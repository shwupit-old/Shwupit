package models



type Review struct {
	ReviewID   string `json:"review_id"`
	ProductID  string `json:"product_id"`
	UserID     string `json:"user_id"`
	ReviewText string `json:"review_text"`
	Rating     int    `json:"rating"`
}
