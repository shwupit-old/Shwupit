package handlers

import (
    "encoding/json"
    "net/http"
    "api/model"
    "api/db"
    "log"
)

func RegisterHandlers(){
    http.HandleFunc("/swappers", swappersHandler)
}

func swappersHandler(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodPost:
        log.Println("Got a request from swappers")
        var swapper model.Swapper
        if err := json.NewDecoder(r.Body).Decode(&swapper); err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }
        log.Printf("Attempting to insert swapper: %+v\n", swapper)
        if err := db.InsertSwapper(swapper); err != nil {
            http.Error(w, "Failed to insert swapper", http.StatusInternalServerError)
            return
        }
        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(swapper)
    default:
        w.WriteHeader(http.StatusMethodNotAllowed)
    }
}
    


