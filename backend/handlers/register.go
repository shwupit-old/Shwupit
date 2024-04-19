package handlers

import (
	"api/db"
	"api/models"
	"encoding/json"
	"log"
	"net/http"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
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