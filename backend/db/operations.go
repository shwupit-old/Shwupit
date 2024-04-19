package db

import (
	"github.com/gocql/gocql"
	"time"
	"log"
	"api/models"
)

func InsertSwapper(swapper models.Swapper) error {
	err := session.Query(`INSERT INTO swappers (user_id, username, email, location, swapping_history, availability, profile_picture, account_creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ? )`,
		swapper.UserID, swapper.Username, swapper.Email, swapper.Location, swapper.SwappingHistory, swapper.Availability, swapper.ProfilePicture, swapper.AccountCreationDate).Exec()
	if err != nil {
		log.Printf("Failed to insert swapper: %+v, error: %v\n", swapper, err)
	}
	return err
}

func GetSwapperByUsername(username string) (*models.Swapper, error) {
	var swapper models.Swapper
	err := session.Query(`SELECT user_id, username, email, location, swapping_history, availability, profile_picture, account_creation_date FROM swappers WHERE username = ? LIMIT 1 ALLOW FILTERING`, username).Consistency(gocql.One).Scan(
		&swapper.UserID,
		&swapper.Username,
		&swapper.Email,
		&swapper.Location,
		&swapper.SwappingHistory,
		&swapper.Availability,
		&swapper.ProfilePicture,
		&swapper.AccountCreationDate,
	)

	if err != nil {
		log.Printf("Failed to retrieve swapper by username '%s': %v", username, err)
		return nil, err
	}
	log.Printf("Login successful welcome '%s'", username)
	return &swapper, nil
}

func AddHashImage(hash string, name string, filePath string) error {
	err := session.Query(`INSERT INTO images (hash, name, imagePath, created) VALUES (?, ?, ?, ?)`,
		hash, name, filePath, time.Now()).Exec()
	if err != nil {
		log.Printf("Failed to insert image: %v", err)
		return err
	}
	return nil
}
