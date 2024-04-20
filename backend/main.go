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
    mux := http.NewServeMux()
    handlers.RegisterHandlers(mux)
    db.StartDatabase()
    wrappedMux := db.CorsMiddleware(mux)
    log.Println("Starting server on :8080")
    if err := http.ListenAndServe(":8080", wrappedMux); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}