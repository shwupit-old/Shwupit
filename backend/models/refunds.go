package models

type Refund struct {
	RefundID        string  `json:"refund_id"`
	OrderID         string  `json:"order_id"`
	ProductID       string  `json:"product_id"`
	UserID          string  `json:"user_id"`
	ReasonForRefund string  `json:"reason_for_refund"`
	Amount          float64 `json:"amount"`
	Status          string  `json:"status"`
	CreatedAt       string  `json:"created_at"`
	UpdatedAt       string  `json:"updated_at"`
}
