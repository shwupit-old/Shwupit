package handlers

import (
	"api/db"
	"encoding/json"
	"net/http"
	"time"

	"log"

	"github.com/gocql/gocql"
	"github.com/gorilla/mux"
)

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("UpdateUserHandler called")

	// Additional logging for incoming request
	log.Printf("Request URL: %s", r.URL)
	log.Printf("Request Method: %s", r.Method)
	log.Printf("Request Headers: %v", r.Header)

	vars := mux.Vars(r)
	userID, err := gocql.ParseUUID(vars["user_id"])
	if err != nil {
		log.Printf("Invalid user ID: %v", err)
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	var updatedUser struct {
		Username          string `json:"username"`
		FirstName         string `json:"firstName"`
		LastName          string `json:"lastName"`
		Email             string `json:"email"`
		Country           string `json:"country"`
		Currency          string `json:"currency"`
		Bio               string `json:"bio"`
		ProfilePictureURL string `json:"profilePictureURL"`
	}

	if err := json.NewDecoder(r.Body).Decode(&updatedUser); err != nil {
		log.Printf("Failed to decode request payload: %v", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Printf("Decoded user data: %+v", updatedUser)

	// Fetch the current user from the database
	currentUser, err := db.GetUserByID(userID)
	if err != nil {
		log.Printf("User not found: %v", err)
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Update the user with new data
	currentUser.Username = updatedUser.Username
	currentUser.FirstName = updatedUser.FirstName
	currentUser.LastName = updatedUser.LastName
	currentUser.Email = updatedUser.Email
	currentUser.Country = updatedUser.Country
	currentUser.Currency = updatedUser.Currency
	currentUser.Bio = updatedUser.Bio
	currentUser.ProfilePictureURL = updatedUser.ProfilePictureURL
	currentUser.UpdatedAt = time.Now()

	log.Printf("Updated user data: %+v", currentUser)

	// Save the updated user to the database
	if err := db.UpdateUser(&currentUser); err != nil {
		log.Printf("Failed to update user: %v", err)
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(currentUser); err != nil {
		log.Printf("Failed to encode response: %v", err)
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
