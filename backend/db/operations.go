package db

import (
	"api/models"
	"fmt"
	"log"
	"time"

	"github.com/gocql/gocql"
)

type DB interface {
	InsertSwapper(swapper models.Swapper) error
	GetSwapperByUsername(username string) (*models.Swapper, error)
	InsertHashImage(hash, name, filePath string) error
}

type CassandraDB struct {
	session *gocql.Session
}

func NewCassandraDB(session *gocql.Session) *CassandraDB {
	return &CassandraDB{session: session}
}

func (db *CassandraDB) InsertSwapper(swapper models.Swapper) error {
	if swapper.UserID == (gocql.UUID{}) || swapper.Username == "" || swapper.Email == "" {
		return fmt.Errorf("swapper must have valid UserID, Username, and Email")
	}

	err := db.session.Query(`INSERT INTO swappers (user_id, username, email, location, swapping_history, availability, profile_picture, account_creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ? )`,
		swapper.UserID, swapper.Username, swapper.Email, swapper.Location, swapper.SwappingHistory, swapper.Availability, swapper.ProfilePicture, swapper.AccountCreationDate).Exec()
	if err != nil {
		log.Printf("Failed to insert swapper: %+v, error: %v\n", swapper, err)
	}
	return err
}

func (db *CassandraDB) GetSwapperByUsername(username string) (*models.Swapper, error) {
	if username == "" {
		log.Printf("Username cannot be empty")
		return nil, fmt.Errorf("username cannot be empty")
	}

	var swapper models.Swapper
	err := db.session.Query(`SELECT user_id, username, email, location, swapping_history, availability, profile_picture, account_creation_date FROM swappers WHERE username = ? LIMIT 1 ALLOW FILTERING`, username).Consistency(gocql.One).Scan(
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

func (db *CassandraDB) InsertHashImage(hash, name, filePath string) error {
	if hash == "" || name == "" || filePath == "" {
		log.Printf("Hash, name, and filePath cannot be empty")
		return fmt.Errorf("hash, name, and filePath cannot be empty")
	}

	err := db.session.Query(`INSERT INTO images (hash, name, imagePath, created) VALUES (?, ?, ?, ?)`,
		hash, name, filePath, time.Now()).Exec()
	if err != nil {
		log.Printf("Failed to insert image: %v", err)
		return err
	}
	return nil
}
