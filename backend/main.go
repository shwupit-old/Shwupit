package main

import (
	"fmt"
	"github.com/gocql/gocql"
	"log"
	"api/db"
)

func main() {
    
    db.TestConnection()
	cluster := gocql.NewCluster("127.0.0.1:9042")
	// cluster.Keyspace = "user_data"
	cluster.Consistency = gocql.All

	session, err := cluster.CreateSession()
	if err != nil {
		log.Fatalf("Could not connect to Cassandra: %v", err)
	}
	defer session.Close()

    cql := "CREATE KEYSPACE IF NOT EXISTS user_data WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3'} AND durable_writes = true;"

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create keyspace: %v", err)
	} else {
		fmt.Println("Keyspace created successfully")
	}
}
