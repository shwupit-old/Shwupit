package model

import (
	"time"

	"github.com/gocql/gocql"
)

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
