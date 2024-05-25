package model

import (
	"time"

	"github.com/gocql/gocql"
)

type SwapRequest struct {
	ID            gocql.UUID `json:"id"`
	SwapID        gocql.UUID `json:"swap_id"`
	RequestStatus string     `json:"request_status"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}
