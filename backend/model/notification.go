package model

import (
	"time"

	"github.com/gocql/gocql"
)

type Notification struct {
	ID               gocql.UUID `json:"id"`
	UserID           gocql.UUID `json:"user_id"`
	NotificationType string     `json:"notification_type"`
	NotificationText string     `json:"notification_text"`
	ReadStatus       bool       `json:"read_status"`
	CreatedAt        time.Time  `json:"created_at"`
}
