package models

import "github.com/gocql/gocql"

type Image struct {
	Hash             string
	Name             string
	ImageDescription string
	ImageURL         string     `json:"image_url"`
	ProductID        gocql.UUID `json:"product_id"`
}
