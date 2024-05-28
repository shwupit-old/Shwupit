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

var (
	awsSession *session.Session
	s3Client   *s3.S3
	bucketName = "shwupit-images"
)

func init() {
	var err error
	awsSession, err = session.NewSession(&aws.Config{
		Region: aws.String("eu-north-1"),
	})
	if err != nil {
		log.Fatalf("Failed to create AWS session: %v", err)
	}
	s3Client = s3.New(awsSession)
}

func uploadAttachmentsHandler(w http.ResponseWriter, r *http.Request) {
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

	err = r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Failed to parse multipart form", http.StatusInternalServerError)
		return
	}

	files := r.MultipartForm.File["image"]
	var attachments []model.Image

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Failed to open file", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		key := fmt.Sprintf("%s/images/%s", userID, fileHeader.Filename)
		_, err = s3Client.PutObject(&s3.PutObjectInput{
			Bucket: aws.String(bucketName),
			Key:    aws.String(key),
			Body:   file,
		})
		if err != nil {
			http.Error(w, "Failed to upload image to S3", http.StatusInternalServerError)
			log.Printf("Failed to upload image to S3: %v\n", err)
			return
		}

		hash := db.GenerateHash(fileHeader.Filename)
		image := model.Image{
			Hash:      hash,
			Name:      fileHeader.Filename,
			ImagePath: fmt.Sprintf("https://%s.s3.amazonaws.com/%s", bucketName, key),
			Created:   time.Now(),
			Updated:   time.Now(),
		}

		if err := db.InsertImage(image); err != nil {
			http.Error(w, "Failed to save image information", http.StatusInternalServerError)
			return
		}

		attachments = append(attachments, image)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(attachments)
}
