package main

import (
	"api/db"
	"api/handlers"
	"log"
	"net/http"
)

func main() {
	session, err := db.Init()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer session.Close()

	cassandraDB := db.NewCassandraDB(session)

	mux := http.NewServeMux()
	handlers.RegisterHandlers(mux, cassandraDB)

	wrappedMux := db.CorsMiddleware(mux)

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", wrappedMux); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
