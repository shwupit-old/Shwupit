package db

import (
	"api/model"
	"log"
	"github.com/gocql/gocql"
)

var session *gocql.Session

func init() {
	var err error
	cluster := gocql.NewCluster("127.0.0.1:9042")
	cluster.Keyspace = "swap_platform"
	cluster.Consistency = gocql.All
	session, err = cluster.CreateSession()
	if err != nil {
		log.Fatalf("Could not connect to Cassandra : %v", err)
	}
}

func InsertSwapper(swapper model.Swapper) error {

	err := session.Query(`INSERT INTO swappers (user_id, username, email, location, swapping_history, availability, profile_picture, account_creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ? )`,
		swapper.UserID, swapper.Username, swapper.Email, swapper.Location, swapper.SwappingHistory, swapper.Availability, swapper.ProfilePicture, swapper.AccountCreationDate).Exec()
	if err != nil {
		log.Printf("Failed to insert swapper: %+v, error: %v\n", swapper, err) // Log the error
	}
	return err
}


func GetUserByUsername(username string) (*model.Swapper, error) {
    var swapper model.Swapper

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
	log.Printf("Login successful welcome '%s'" ,username)
    return &swapper, nil
}
