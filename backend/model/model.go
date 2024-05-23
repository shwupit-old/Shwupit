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
type Image struct {
	Hash             string    `json:"hash"`
	Name             string    `json:"name"`
	ImageDescription string    `json:"imageDescription"`
	ImagePath        string    `json:"imagePath"`
	Created          time.Time `json:"created"`
	Updated          time.Time `json:"updated"`
	Deleted          time.Time `json:"deleted"`
}

type Item struct {
	ID          gocql.UUID `json:"id"`
	UserID      gocql.UUID `json:"user_id"`
	ItemPhoto   string     `json:"item_photo"`
	ItemName    string     `json:"item_name"`
	Description string     `json:"description"`
	Price       float32    `json:"price"`
	Country     string     `json:"country"`
	City        string     `json:"city"`
	Subcategory string     `json:"subcategory"`
	Category    string     `json:"category"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

type Dispute struct {
	ID                 gocql.UUID `json:"id"`
	SwapID             gocql.UUID `json:"swap_id"`
	UserID             gocql.UUID `json:"user_id"`
	CounterpartyUserID gocql.UUID `json:"counterparty_user_id"`
	DisputeReason      string     `json:"dispute_reason"`
	DisputeStatus      string     `json:"dispute_status"`
	DisputeDetails     string     `json:"dispute_details"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
	ResolvedBy         gocql.UUID `json:"resolved_by"`
	ResolutionDetails  string     `json:"resolution_details"`
	ResolutionDate     time.Time  `json:"resolution_date"`
}

type Swap struct {
	ID                 gocql.UUID `json:"id"`
	UserID             gocql.UUID `json:"user_id"`
	CounterpartyUserID gocql.UUID `json:"counterparty_user_id"`
	ItemID             gocql.UUID `json:"item_id"`
	CounterpartyItemID gocql.UUID `json:"counterparty_item_id"`
	SwapStatus         string     `json:"swap_status"`
	SwapValue          float32    `json:"swap_value"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
}

type SwapRequest struct {
	ID            gocql.UUID `json:"id"`
	SwapID        gocql.UUID `json:"swap_id"`
	RequestStatus string     `json:"request_status"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

type Rating struct {
	ID         gocql.UUID `json:"id"`
	SwapID     gocql.UUID `json:"swap_id"`
	ReviewerID gocql.UUID `json:"reviewer_id"`
	RevieweeID gocql.UUID `json:"reviewee_id"`
	Rating     float32    `json:"rating"`
	ReviewText string     `json:"review_text"`
	CreatedAt  time.Time  `json:"created_at"`
}

type Notification struct {
	ID               gocql.UUID `json:"id"`
	UserID           gocql.UUID `json:"user_id"`
	NotificationType string     `json:"notification_type"`
	NotificationText string     `json:"notification_text"`
	ReadStatus       bool       `json:"read_status"`
	CreatedAt        time.Time  `json:"created_at"`
}

type SavedItem struct {
	ID          gocql.UUID `json:"id"`
	UserID      gocql.UUID `json:"user_id"`
	ItemID      gocql.UUID `json:"item_id"`
	ItemDetails string     `json:"item_details"`
	SavedAt     time.Time  `json:"saved_at"`
}

type Payment struct {
	ID                    gocql.UUID `json:"id"`
	SwapID                gocql.UUID `json:"swap_id"`
	UserID                gocql.UUID `json:"user_id"`
	CounterpartyUserID    gocql.UUID `json:"counterparty_user_id"`
	PaymentAmount         float32    `json:"payment_amount"`
	PaymentStatus         string     `json:"payment_status"`
	StripePaymentIntentID string     `json:"stripe_payment_intent_id"`
	CreatedAt             time.Time  `json:"created_at"`
	UpdatedAt             time.Time  `json:"updated_at"`
}
