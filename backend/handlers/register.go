package handlers

import (
	"api/models"
	"encoding/json"
	"log"
	"net/http"
)

func (h *Handlers) RegisterHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		log.Println("Got a request from swappers")

		var swapper models.Swapper

		if err := json.NewDecoder(r.Body).Decode(&swapper); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		log.Printf("Attempting to insert swapper: %+v\n", swapper)

		if err := h.DB.InsertSwapper(swapper); err != nil {
			http.Error(w, "Failed to insert swapper", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(swapper)
	}
}
