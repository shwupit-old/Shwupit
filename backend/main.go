package main

import (
	"api/db"
	"api/handlers"
	"fmt"
	"log"
	"net/http"

	"github.com/gocql/gocql"
)

func main() {
	handlers.RegisterHandlers()

	// db.TestConnection()
	cluster := gocql.NewCluster("127.0.0.1:9042")
	// cluster.Keyspace = "user_data"
	cluster.Keyspace = "swap_platform"
	cluster.Consistency = gocql.All

	session, err := cluster.CreateSession()
	if err != nil {
		log.Fatalf("Could not connect to Cassandra: %v", err)
	}
	defer session.Close()

	cql := "CREATE KEYSPACE IF NOT EXISTS swap_platform WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'} AND durable_writes = true;"

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create keyspace: %v", err)
	} else {
		fmt.Println("Keyspace created successfully")
	}

	db.CreateTable(session)

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
