package handlers

import (
	"api/db"
	"encoding/json"
	"log"
	"net/http"
)

func loginHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")

	// Handle preflight request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Decode the JSON request body
	var request struct {
		Identifier string `json:"identifier"` // Can be either username or email
		Password   string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		log.Printf("Invalid request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("Decoded login request: %+v", request)

	// Retrieve the user by username or email
	user, err := db.GetUserByUsernameOrEmail(request.Identifier)
	if err != nil {
		log.Printf("Error retrieving user: %v", err)
		http.Error(w, "Invalid username/email or password", http.StatusUnauthorized)
		return
	}

	// Verify the user's password
	if user.Username == "" {
		log.Println("Invalid username/email or password: username not found")
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Invalid username/email or password",
		})
		return
	}

	if !db.VerifyPassword(user.PasswordHash, request.Password) {
		log.Println("Invalid username/email or password: password incorrect")
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Invalid username/email or password",
		})
		return
	}

	// Generate JWT token for the user
	token, err := GenerateJWT(user)
	if err != nil {
		log.Printf("Error generating token: %v", err)
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	log.Printf("Generated token: %s", token)

	// Send the successful response with the token
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user":  user,
	})
}
