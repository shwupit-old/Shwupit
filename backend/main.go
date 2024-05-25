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
	log.Println("Database started successfully")
	router := mux.NewRouter()

	// Apply CORS middleware to all routes
	router.Use(corsMiddleware)

	// Register handlers
	handlers.RegisterHandlers(router)

	log.Println("Starting server on :8080")
	http.ListenAndServe(":8080", router)
}

// corsMiddleware sets the necessary CORS headers
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from your frontend origin
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")

		// Handle preflight request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
