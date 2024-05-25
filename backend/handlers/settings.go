package handlers

import (
	"log"
	"net/http"
)

func settingsHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Settings handler triggered")
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"message": "This is the settings endpoint"}`))
}
