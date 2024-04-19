package models

type ShippingType string

type Shipping struct {
	ShippingID  string       `json:"shipping_id"`
	ShippingType ShippingType `json:"shipping_type"`
	ShippingCost float64      `json:"shipping_cost"`
	IsGlobal   bool         `json:"is_global"`
}
