package models

type PaymentIntent struct {
	TrackingID string `json:"tracking_id"`
	PaymentGateway string `json:"payment_gateway"`
	RecallGateway string `json:"recall_gateway"`
}
