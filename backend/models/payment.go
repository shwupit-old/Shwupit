package models



type Payment struct {
	PaymentID    string  `json:"payment_id"`
	OrderID      string  `json:"order_id"`
	UserID       string  `json:"user_id"`
	PaymentType  string  `json:"payment_type"`
	Amount       float64 `json:"amount"`
	Status       string  `json:"status"`
	CreatedAt    string  `json:"created_at"`
	UpdatedAt    string  `json:"updated_at"`
}
