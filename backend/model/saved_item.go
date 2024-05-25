package model

import (
	"time"

	"github.com/gocql/gocql"
)

type SavedItem struct {
	ID          gocql.UUID `json:"id"`
	UserID      gocql.UUID `json:"user_id"`
	ItemID      gocql.UUID `json:"item_id"`
	ItemDetails string     `json:"item_details"`
	SavedAt     time.Time  `json:"saved_at"`
}
