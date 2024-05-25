package handlers

import (
	"api/db"
	"api/model"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gocql/gocql"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUserHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received registration request")
	var user model.User

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&user); err != nil {
		log.Printf("Invalid request payload: %v", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Printf("Registering user: %+v", user)

	// Check if the username already exists
	existingUser, err := db.GetUserByUsername(user.Username)
	if err != nil {
		log.Printf("Error checking username: %v", err)
		http.Error(w, "Error checking username", http.StatusInternalServerError)
		return
	}
	if existingUser.Username != "" {
		log.Printf("Username already exists: %s", user.Username)
		http.Error(w, "Username already exists", http.StatusConflict)
		return
	}

	// Check if the email already exists
	existingUser, err = db.GetUserByEmail(user.Email)
	if err != nil {
		log.Printf("Error checking email: %v", err)
		http.Error(w, "Error checking email", http.StatusInternalServerError)
		return
	}
	if existingUser.Email != "" {
		log.Printf("Email already exists: %s", user.Email)
		http.Error(w, "Email already exists", http.StatusConflict)
		return
	}

	// Generate a new UUID for the user
	user.ID = gocql.TimeUUID()

	// Hash the user's password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Failed to hash password: %v", err)
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}
	user.PasswordHash = string(hashedPassword)

	// Manually set the created and updated timestamps
	user.CreatedAt = time.Now().UTC()
	user.UpdatedAt = user.CreatedAt

	// Ensure optional fields are initialized
	if user.Bio == "" {
		user.Bio = ""
	}

	if user.PaymentDetails == (gocql.UUID{}) {
		user.PaymentDetails = gocql.TimeUUID()
	}

	// Insert the user into the database
	if err := db.InsertUser(user); err != nil {
		log.Printf("Failed to insert user: %v", err)
		http.Error(w, "Failed to insert user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Generate JWT token
	token, err := GenerateJWT(user)
	if err != nil {
		log.Printf("Failed to generate token: %v", err)
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	// Return the token and user data in the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user":  user,
	})
	log.Println("User registered successfully")
}
