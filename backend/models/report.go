package models

type Report struct {
	ReportID   string `json:"report_id"`
	ProductID  string `json:"product_id"`
	UserID     string `json:"user_id"`
	ReportText string `json:"report_text"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
}