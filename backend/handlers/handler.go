package handlers

import
(
	"net/http"
)


func RegisterHandlers() {
	http.HandleFunc("/swappers/register", RegisterHandler)
	http.HandleFunc("/swappers/login", loginHandler)
	http.HandleFunc("/image/upload", uploadHandler)
}





