package main

import (
	"api/db"
	"api/handlers"

	// "fmt"
	"log"
	"net/http"
	// "github.com/gocql/gocql"
)

func main() {
	handlers.RegisterHandlers()
	db.StartDatabase()

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
