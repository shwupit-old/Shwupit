package handlers

import (
	"api/db"
	"api/model"
	"encoding/json"
	"log"
	"net/http"
)

func RegisterHandlers() {
	http.HandleFunc("/register", swappersHandler)
	http.HandleFunc("/login", loginHandler)
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
