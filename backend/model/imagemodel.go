package model

import "github.com/gocql/gocql"

type image struct {
	hash             string
	name             string
	imageDescription string
	ImageURL         string     `json:"image_url"`
	ProductID        gocql.UUID `json:"product_id"`
}
