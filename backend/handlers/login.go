package handlers

import (
	"encoding/json"
	"net/http"
)

func (h *Handlers) LoginHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		var request struct {
			Username string `json:"username"`
		}

		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if request.Username == "" {
			http.Error(w, "Username is required", http.StatusBadRequest)
			return
		}

		swapper, err := h.DB.GetSwapperByUsername(request.Username)
		if err != nil {
			http.Error(w, "Failed to retrieve swapper", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(swapper)
	}
}
