package models

type Order struct {
	OrderID         string    `json:"order_id"`
	UserID          string    `json:"user_id"`
	ProductID       string    `json:"product_id"`
	Quantity        int       `json:"quantity"`
	SwapperContact  string    `json:"swapper_contact"`
	Products        []Product `json:"products"`
	PaymentGateway  string    `json:"payment_gateway"`
	DiscountCode    string    `json:"discount_code"`
	Amount          float64   `json:"amount"`
	Status          string    `json:"status"`
	Tax             float64   `json:"tax"`
	Discount        float64   `json:"discount"`
	TotalAmount     float64   `json:"total_amount"`
	BillingAddress  string    `json:"billing_address"`
	DiliveryAddress string    `json:"dilivery_address"`
	DevileryDate    string    `json:"devilery_date"`
	DiveryFee       float64   `json:"divery_fee"`
	CreatedAt       string    `json:"created_at"`
	UpdatedAt       string    `json:"updated_at"`
}
