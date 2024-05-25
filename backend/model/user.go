package model

import (
	"time"

	"github.com/gocql/gocql"
)

type User struct {
	ID                gocql.UUID   `json:"id" cql:"user_id"`
	Username          string       `json:"username" cql:"username"`
	Email             string       `json:"email" cql:"email"`
	PasswordHash      string       `json:"password" cql:"password_hash"`
	FirstName         string       `json:"firstName" cql:"first_name"`
	LastName          string       `json:"lastName" cql:"last_name"`
	Country           string       `json:"country" cql:"country"`
	ProfilePictureURL string       `json:"profilePictureURL" cql:"profile_picture_url"`
	UserRating        float32      `json:"userRating" cql:"user_rating"`
	PaymentDetails    gocql.UUID   `json:"paymentDetails" cql:"payment_details"`
	SavedItems        []gocql.UUID `json:"savedItems" cql:"saved_items"`
	Currency          string       `json:"currency" cql:"currency"`
	Bio               string       `json:"bio" cql:"bio"`
	CreatedAt         time.Time    `json:"createdAt" cql:"created_at"`
	UpdatedAt         time.Time    `json:"updatedAt" cql:"updated_at"`
}
