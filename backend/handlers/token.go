package handlers

import (
	"api/db"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
)

func tokenHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")

	// Handle preflight request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	var request struct {
		Identifier string `json:"identifier"` // Can be either username or email
		Password   string `json:"password"`
	}

	// Log the request body for debugging purposes
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("Request body: %s", string(body))

	if err := json.NewDecoder(strings.NewReader(string(body))).Decode(&request); err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("Decoded request: %+v", request)

	user, err := db.GetUserByUsernameOrEmail(request.Identifier)
	if err != nil {
		log.Printf("Error retrieving user: %v", err)
		http.Error(w, "Failed to retrieve user", http.StatusInternalServerError)
		return
	}

	log.Printf("Retrieved user: %+v", user)

	if user.Username == "" {
		log.Println("Invalid username/email or password")
		http.Error(w, "Invalid username/email or password", http.StatusUnauthorized)
		return
	}

	if !db.VerifyPassword(user.PasswordHash, request.Password) {
		log.Println("Invalid username/email or password")
		http.Error(w, "Invalid username/email or password", http.StatusUnauthorized)
		return
	}

	token, err := GenerateJWT(user)
	if err != nil {
		log.Printf("Error generating token: %v", err)
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	log.Printf("Generated token: %s", token)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user":  user,
	})
}
