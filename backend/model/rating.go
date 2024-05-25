package model

import (
	"time"

	"github.com/gocql/gocql"
)

type Rating struct {
	ID         gocql.UUID `json:"id"`
	SwapID     gocql.UUID `json:"swap_id"`
	ReviewerID gocql.UUID `json:"reviewer_id"`
	RevieweeID gocql.UUID `json:"reviewee_id"`
	Rating     float32    `json:"rating"`
	ReviewText string     `json:"review_text"`
	CreatedAt  time.Time  `json:"created_at"`
}
