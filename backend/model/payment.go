package model

import (
	"time"

	"github.com/gocql/gocql"
)

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
