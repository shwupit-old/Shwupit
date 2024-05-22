package main

import (
	"api/db"
	"api/handlers"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	db.StartDatabase()

	router := mux.NewRouter()

	// Add CORS middleware to the router
	router.Use(corsMiddleware)

	// Register handlers
	handlers.RegisterHandlers(router)
	log.Println("Database setup completed.")
	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatalf("Could not start server: %s\n", err.Error())
	}
}

// corsMiddleware sets the necessary CORS headers
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
