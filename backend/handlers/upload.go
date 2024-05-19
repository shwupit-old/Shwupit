package handlers

import (
	"api/db"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

func (h *Handlers) UploadHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		file, handler, err := r.FormFile("image")
		if err != nil {
			http.Error(w, "Failed to upload image", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		newFilePath := fmt.Sprintf("images/%s", handler.Filename)

		err = saveFile(newFilePath, file)
		if err != nil {
			http.Error(w, "Failed to save file", http.StatusInternalServerError)
			return
		}

		hash, err := db.GenerateHash(handler.Filename)
		if err != nil {
			http.Error(w, "Failed to generate hash", http.StatusInternalServerError)
			return
		}

		if err := h.DB.InsertHashImage(hash, handler.Filename, newFilePath); err != nil {
			http.Error(w, "Failed to insert image hash", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func saveFile(filePath string, file multipart.File) error {
	err := os.MkdirAll(filepath.Dir(filePath), 0755)
	if err != nil {
		return err
	}

	newFile, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer newFile.Close()

	_, err = io.Copy(newFile, file)
	return err
}
