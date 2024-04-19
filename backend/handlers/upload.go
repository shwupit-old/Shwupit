package handlers

import (
	"api/db"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	file, handler, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to upload image", http.StatusInternalServerError)
		fmt.Printf("Failed to upload image: %v\n", err)
		return
	}

	defer file.Close()

	newFilePath := fmt.Sprintf("images/%s", handler.Filename)

	err = os.MkdirAll(filepath.Dir(newFilePath), 0755)

	if err != nil {
		http.Error(w, "Failed to create directory", http.StatusInternalServerError)
		fmt.Printf("Failed to create directory: %v\n", err)
		return
	}

	newFile, err := os.Create(newFilePath)
	if err != nil {
		http.Error(w, "Failed to create file", http.StatusInternalServerError)
		fmt.Printf("Failed to create file: %v\n", err)
		return
	}
	defer newFile.Close()

	_, err = io.Copy(newFile, file)
	if err != nil {
		http.Error(w, "Failed to copy file", http.StatusInternalServerError)
		fmt.Printf("Failed to copy file: %v\n", err)
		return
	}

	name := handler.Filename
	fmt.Fprintf(w, "File uploaded: %v", name)

	hash := db.GenerateHash(handler.Filename)
	err = db.AddHashImage(hash, name, newFilePath)
	if err != nil {
		http.Error(w, "Failed to add image to database", http.StatusInternalServerError)
		fmt.Printf("Failed to add image to database: %v\n", err)
		return
	}

}