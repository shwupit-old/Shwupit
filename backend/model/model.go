package model

import "github.com/gocql/gocql"

type User struct {
	ID                gocql.UUID   `json:"id"`
	Username          string       `json:"username"`
	Email             string       `json:"email"`
	PasswordHash      string       `json:"password_hash"`
	FirstName         string       `json:"first_name"`
	LastName          string       `json:"last_name"`
	PhoneNumber       string       `json:"phone_number"`
	ProfilePictureURL string       `json:"profile_picture_url"`
	UserRating        float32      `json:"user_rating"`
	PaymentDetails    string       `json:"payment_details"`
	CreatedAt         gocql.UUID   `json:"created_at"`
	UpdatedAt         gocql.UUID   `json:"updated_at"`
	SavedItems        []gocql.UUID `json:"saved_items"`
}

type Image struct {
	Hash             string     `json:"hash"`
	Name             string     `json:"name"`
	ImageDescription string     `json:"imageDescription"`
	ImagePath        string     `json:"imagePath"`
	Created          gocql.UUID `json:"created"`
	Updated          gocql.UUID `json:"updated"`
	Deleted          gocql.UUID `json:"deleted"`
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
	CreatedAt   gocql.UUID `json:"created_at"`
	UpdatedAt   gocql.UUID `json:"updated_at"`
}

type Dispute struct {
	ID                 gocql.UUID `json:"id"`
	SwapID             gocql.UUID `json:"swap_id"`
	UserID             gocql.UUID `json:"user_id"`
	CounterpartyUserID gocql.UUID `json:"counterparty_user_id"`
	DisputeReason      string     `json:"dispute_reason"`
	DisputeStatus      string     `json:"dispute_status"`
	DisputeDetails     string     `json:"dispute_details"`
	CreatedAt          gocql.UUID `json:"created_at"`
	UpdatedAt          gocql.UUID `json:"updated_at"`
	ResolvedBy         gocql.UUID `json:"resolved_by"`
	ResolutionDetails  string     `json:"resolution_details"`
	ResolutionDate     gocql.UUID `json:"resolution_date"`
}

type Swap struct {
	ID                 gocql.UUID `json:"id"`
	UserID             gocql.UUID `json:"user_id"`
	CounterpartyUserID gocql.UUID `json:"counterparty_user_id"`
	ItemID             gocql.UUID `json:"item_id"`
	CounterpartyItemID gocql.UUID `json:"counterparty_item_id"`
	SwapStatus         string     `json:"swap_status"`
	SwapValue          float32    `json:"swap_value"`
	CreatedAt          gocql.UUID `json:"created_at"`
	UpdatedAt          gocql.UUID `json:"updated_at"`
}

type SwapRequest struct {
	ID            gocql.UUID `json:"id"`
	SwapID        gocql.UUID `json:"swap_id"`
	RequestStatus string     `json:"request_status"`
	CreatedAt     gocql.UUID `json:"created_at"`
	UpdatedAt     gocql.UUID `json:"updated_at"`
}

type Rating struct {
	ID         gocql.UUID `json:"id"`
	SwapID     gocql.UUID `json:"swap_id"`
	ReviewerID gocql.UUID `json:"reviewer_id"`
	RevieweeID gocql.UUID `json:"reviewee_id"`
	Rating     float32    `json:"rating"`
	ReviewText string     `json:"review_text"`
	CreatedAt  gocql.UUID `json:"created_at"`
}

type Notification struct {
	ID               gocql.UUID `json:"id"`
	UserID           gocql.UUID `json:"user_id"`
	NotificationType string     `json:"notification_type"`
	NotificationText string     `json:"notification_text"`
	ReadStatus       bool       `json:"read_status"`
	CreatedAt        gocql.UUID `json:"created_at"`
}

type SavedItem struct {
	ID          gocql.UUID `json:"id"`
	UserID      gocql.UUID `json:"user_id"`
	ItemID      gocql.UUID `json:"item_id"`
	ItemDetails string     `json:"item_details"`
	SavedAt     gocql.UUID `json:"saved_at"`
}

type Payment struct {
	ID                    gocql.UUID `json:"id"`
	SwapID                gocql.UUID `json:"swap_id"`
	UserID                gocql.UUID `json:"user_id"`
	CounterpartyUserID    gocql.UUID `json:"counterparty_user_id"`
	PaymentAmount         float32    `json:"payment_amount"`
	PaymentStatus         string     `json:"payment_status"`
	StripePaymentIntentID string     `json:"stripe_payment_intent_id"`
	CreatedAt             gocql.UUID `json:"created_at"`
	UpdatedAt             gocql.UUID `json:"updated_at"`
}
