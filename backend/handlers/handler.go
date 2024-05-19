package handlers

import (
	"api/db"
	"net/http"
)

type Handlers struct {
	DB db.DB
}

func RegisterHandlers(mux *http.ServeMux, db db.DB) {
	if mux == nil {
		panic("mux cannot be nil")
	}
	if db == nil {
		panic("db cannot be nil")
	}

	handlers := &Handlers{DB: db}

	mux.HandleFunc("/swappers/register", handlers.RegisterHandler())
	mux.HandleFunc("/swappers/login", handlers.LoginHandler())
	mux.HandleFunc("/image/upload", handlers.UploadHandler())
}
