package model

import (
	"time"

	"github.com/gocql/gocql"
)

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
