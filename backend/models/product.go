package models

import (
	"time"

	"github.com/gocql/gocql"
)

type Product struct {
	ProductID          gocql.UUID `json:"product_id"`
	ProductName        string     `json:"product_name"`
	ProductType        string     `json:"product_type"`
	ProductDescription string     `json:"product_description"`
	ProductPrice       float64    `json:"product_price"`
	ProductImage       []string   `json:"product_image"`
	ProductTags        []string   `json:"product_tags"`
	ProductStartDate   time.Time  `json:"product_start_date"`
	ProductEndDate     time.Time  `json:"product_end_date"`
	SwapperID          Swapper    `json:"product_owner"`
}
