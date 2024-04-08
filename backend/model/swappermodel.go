package model

import (
	"time"
	"github.com/gocql/gocql"
)

type Swapper struct {
	UserID   gocql.UUID `json:"user_id"`
	Username string     `json:"username"`
	Email    string     `json:"email"`
	Location string     `json:"location"`
	// RatingFeedback      map[time.Time]string `json:"rating_feedback"`
	SwappingHistory     []string  `json:"swapping_history"`
	Availability        string    `json:"availability"`
	ProfilePicture      string    `json:"profile_picture"`
	AccountCreationDate time.Time `json:"account_creation_date"`
}
