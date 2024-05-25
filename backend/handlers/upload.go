package handlers

import (
	"api/db"
	"api/model"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	file, handler, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to upload image", http.StatusInternalServerError)
		log.Printf("Failed to upload image: %v\n", err)
		return
	}
	defer file.Close()

	newFilePath := fmt.Sprintf("images/%s", handler.Filename)

	err = os.MkdirAll(filepath.Dir(newFilePath), 0755)
	if err != nil {
		http.Error(w, "Failed to create directory", http.StatusInternalServerError)
		log.Printf("Failed to create directory: %v\n", err)
		return
	}

	newFile, err := os.Create(newFilePath)
	if err != nil {
		http.Error(w, "Failed to create file", http.StatusInternalServerError)
		log.Printf("Failed to create file: %v\n", err)
		return
	}
	defer newFile.Close()

	_, err = io.Copy(newFile, file)
	if err != nil {
		http.Error(w, "Failed to copy file", http.StatusInternalServerError)
		log.Printf("Failed to copy file: %v\n", err)
		return
	}

	hash := db.GenerateHash(handler.Filename)
	image := model.Image{
		Hash:      hash,
		Name:      handler.Filename,
		ImagePath: newFilePath,
		Created:   time.Now(),
		Updated:   time.Now(),
	}

	if err := db.InsertImage(image); err != nil {
		http.Error(w, "Failed to save image information", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "File uploaded: %v", handler.Filename)
}
