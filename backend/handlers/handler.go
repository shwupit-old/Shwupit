package handlers

import (
    "net/http"
)

func RegisterHandlers(mux *http.ServeMux) {
    mux.HandleFunc("/swappers/register", RegisterHandler)
    mux.HandleFunc("/swappers/login", loginHandler)
    mux.HandleFunc("/image/upload", uploadHandler)
}



