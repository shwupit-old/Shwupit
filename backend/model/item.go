package model

import (
	"time"

	"github.com/gocql/gocql"
)

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
