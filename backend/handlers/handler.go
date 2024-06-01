package handlers

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func RegisterHandlers(router *mux.Router) {
	router.HandleFunc("/", rootHandler).Methods("GET")
	router.HandleFunc("/register", RegisterUserHandler).Methods("POST", "OPTIONS")
	router.HandleFunc("/login", loginHandler).Methods("POST", "OPTIONS")
	router.HandleFunc("/token", tokenHandler).Methods("POST", "OPTIONS")
	router.HandleFunc("/upload", uploadHandler).Methods("POST", "OPTIONS")
	router.HandleFunc("/attachments", uploadAttachmentsHandler).Methods("POST", "OPTIONS")
	router.HandleFunc("/settings", settingsHandler).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/user/me", meHandler).Methods("GET", "OPTIONS")
	router.HandleFunc("/me", meHandler).Methods("GET", "OPTIONS")
	router.HandleFunc("/logout", logoutHandler).Methods("POST", "OPTIONS")
	router.HandleFunc("/users/{user_id}", UpdateUserHandler).Methods("PUT", "OPTIONS")
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Welcome to the Go server!")
}
