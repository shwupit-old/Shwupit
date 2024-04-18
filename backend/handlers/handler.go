package handlers

import (
	"api/db"
	"api/model"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func RegisterHandlers() {
	http.HandleFunc("/register", swappersHandler)
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/upload", uploadHandler)
}

func swappersHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		log.Println("Got a request from swappers")
		var swapper model.Swapper
		if err := json.NewDecoder(r.Body).Decode(&swapper); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		log.Printf("Attempting to insert swapper: %+v\n", swapper)
		if err := db.InsertSwapper(swapper); err != nil {
			http.Error(w, "Failed to insert swapper", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(swapper)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Username string `json:"username"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	swapper, err := db.GetUserByUsername(request.Username)
	if err != nil {
		http.Error(w, "Failed to retrieve swapper", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(swapper)
}

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
