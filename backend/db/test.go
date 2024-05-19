package db

import (
	"log"

	"github.com/gocql/gocql"
)

func TestConnection() {
	cluster := gocql.NewCluster("127.0.0.1:9042")
	cluster.Keyspace = "user_data"
	cluster.Consistency = gocql.Quorum

	session, err := cluster.CreateSession()

	if err != nil {
		log.Fatalf("Could not connect to Cassandra %v", err)
	} else {
		log.Println("Success")
	}

	defer session.Close()
}
