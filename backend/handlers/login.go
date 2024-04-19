package handlers

import (
	"api/db"
	"encoding/json"
	"net/http"
)



func loginHandler(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Username string `json:"username"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	swapper, err := db.GetSwapperByUsername(request.Username)
	if err != nil {
		http.Error(w, "Failed to retrieve swapper", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(swapper)
}