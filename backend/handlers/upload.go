package handlers

import (
	"api/db"
	"api/model"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/dgrijalva/jwt-go"
)

func init() {
	awsSession = session.Must(session.NewSession(&aws.Config{
		Region: aws.String("eu-north-1"),
	}))
	s3Client = s3.New(awsSession)
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		http.Error(w, "No token provided", http.StatusUnauthorized)
		return
	}

	tokenString = strings.TrimPrefix(tokenString, "Bearer ")
	claims := &jwt.StandardClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecretKey, nil
	})
	if err != nil || !token.Valid {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	userID := claims.Subject
	if userID == "" {
		http.Error(w, "Invalid user ID in token", http.StatusUnauthorized)
		return
	}

	file, handler, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to upload image", http.StatusInternalServerError)
		log.Printf("Failed to upload image: %v\n", err)
		return
	}
	defer file.Close()

	key := fmt.Sprintf("%s/images/%s", userID, handler.Filename)
	_, err = s3Client.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(key),
		Body:   file,
		ACL:    aws.String("public-read"),
	})
	if err != nil {
		http.Error(w, "Failed to upload image to S3", http.StatusInternalServerError)
		log.Printf("Failed to upload image to S3: %v\n", err)
		return
	}

	hash := db.GenerateHash(handler.Filename)
	image := model.Image{
		Hash:      hash,
		Name:      handler.Filename,
		ImagePath: fmt.Sprintf("https://%s.s3.amazonaws.com/%s", bucketName, key),
		Created:   time.Now(),
		Updated:   time.Now(),
	}

	if err := db.InsertImage(image); err != nil {
		http.Error(w, "Failed to save image information", http.StatusInternalServerError)
		return
	}

	response := map[string]string{
		"fileName": handler.Filename,
		"filePath": image.ImagePath,
		"hash":     hash,
	}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Failed to create response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}
