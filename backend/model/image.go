package model

import "time"

type Image struct {
	Hash             string    `json:"hash"`
	Name             string    `json:"name"`
	ImageDescription string    `json:"imageDescription"`
	ImagePath        string    `json:"imagePath"`
	Created          time.Time `json:"created"`
	Updated          time.Time `json:"updated"`
	Deleted          time.Time `json:"deleted"`
}
