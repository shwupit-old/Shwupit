package db

import (
	"fmt"
	"github.com/gocql/gocql"
	"log"
)

func CreateTable(session *gocql.Session) {
	// Define the CQL for creating a new table
	// Note: Cassandra map keys must be of type text, so we'll convert time.Time to text for `rating_feedback`
	cql := `CREATE TABLE IF NOT EXISTS swappers (
		user_id UUID PRIMARY KEY,
		username TEXT,
		email TEXT,
		location TEXT,
		swapping_history LIST<TEXT>,
		availability TEXT,
		profile_picture TEXT,
		account_creation_date TIMESTAMP
	);`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table created successfully")
}