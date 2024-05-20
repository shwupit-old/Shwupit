package handlers

import (
	"api/db"
	"api/model"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gocql/gocql"
	"golang.org/x/crypto/bcrypt"
)

func RegisterHandlers() {
	http.HandleFunc("/register", userHandler)
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/upload", uploadHandler)
	http.HandleFunc("/items", itemsHandler)
	http.HandleFunc("/disputes", disputesHandler)
	http.HandleFunc("/swaps", swapsHandler)
	http.HandleFunc("/swapRequests", swapRequestsHandler)
	http.HandleFunc("/ratings", ratingsHandler)
	http.HandleFunc("/notifications", notificationsHandler)
	http.HandleFunc("/savedItems", savedItemsHandler)
	http.HandleFunc("/payments", paymentsHandler)
}

func userHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		log.Println("Received a request to register a new user")
		var user model.User
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// Hash the password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.PasswordHash), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Failed to hash password", http.StatusInternalServerError)
			return
		}
		user.PasswordHash = string(hashedPassword)
		user.ID = gocql.TimeUUID() // Generate a new UUID for the user
		if err := db.InsertUser(user); err != nil {
			http.Error(w, "Failed to insert user", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(user)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Identifier string `json:"identifier"` // Can be either username or email
		Password   string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	user, err := db.GetUserByUsernameOrEmail(request.Identifier)
	if err != nil {
		http.Error(w, "Failed to retrieve user", http.StatusInternalServerError)
		return
	}

	if !db.VerifyPassword(user.PasswordHash, request.Password) {
		http.Error(w, "Invalid username/email or password", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	file, handler, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to upload image", http.StatusInternalServerError)
		log.Printf("Failed to upload image: %v\n", err)
		return
	}
	defer file.Close()

	newFilePath := fmt.Sprintf("images/%s", handler.Filename)

	err = os.MkdirAll(filepath.Dir(newFilePath), 0755)
	if err != nil {
		http.Error(w, "Failed to create directory", http.StatusInternalServerError)
		log.Printf("Failed to create directory: %v\n", err)
		return
	}

	newFile, err := os.Create(newFilePath)
	if err != nil {
		http.Error(w, "Failed to create file", http.StatusInternalServerError)
		log.Printf("Failed to create file: %v\n", err)
		return
	}
	defer newFile.Close()

	_, err = io.Copy(newFile, file)
	if err != nil {
		http.Error(w, "Failed to copy file", http.StatusInternalServerError)
		log.Printf("Failed to copy file: %v\n", err)
		return
	}

	hash := db.GenerateHash(handler.Filename)
	image := model.Image{
		Hash:      hash,
		Name:      handler.Filename,
		ImagePath: newFilePath,
		Created:   gocql.TimeUUID(),
		Updated:   gocql.TimeUUID(),
	}

	if err := db.InsertImage(image); err != nil {
		http.Error(w, "Failed to save image information", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "File uploaded: %v", handler.Filename)
}

func itemsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		var item model.Item
		if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		item.ID = gocql.TimeUUID()
		if err := db.InsertItem(item); err != nil {
			http.Error(w, "Failed to insert item", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(item)
	case http.MethodGet:
		items, err := db.GetItems()
		if err != nil {
			http.Error(w, "Failed to get items", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(items)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func disputesHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		var dispute model.Dispute
		if err := json.NewDecoder(r.Body).Decode(&dispute); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		dispute.ID = gocql.TimeUUID()
		if err := db.InsertDispute(dispute); err != nil {
			http.Error(w, "Failed to insert dispute", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(dispute)
	case http.MethodGet:
		disputes, err := db.GetDisputes()
		if err != nil {
			http.Error(w, "Failed to get disputes", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(disputes)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func swapsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		var swap model.Swap
		if err := json.NewDecoder(r.Body).Decode(&swap); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		swap.ID = gocql.TimeUUID()
		if err := db.InsertSwap(swap); err != nil {
			http.Error(w, "Failed to insert swap", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(swap)
	case http.MethodGet:
		swaps, err := db.GetSwaps()
		if err != nil {
			http.Error(w, "Failed to get swaps", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(swaps)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func swapRequestsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		var swapRequest model.SwapRequest
		if err := json.NewDecoder(r.Body).Decode(&swapRequest); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		swapRequest.ID = gocql.TimeUUID()
		if err := db.InsertSwapRequest(swapRequest); err != nil {
			http.Error(w, "Failed to insert swap request", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(swapRequest)
	case http.MethodGet:
		swapRequests, err := db.GetSwapRequests()
		if err != nil {
			http.Error(w, "Failed to get swap requests", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(swapRequests)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func ratingsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		var rating model.Rating
		if err := json.NewDecoder(r.Body).Decode(&rating); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		rating.ID = gocql.TimeUUID()
		if err := db.InsertRating(rating); err != nil {
			http.Error(w, "Failed to insert rating", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(rating)
	case http.MethodGet:
		ratings, err := db.GetRatings()
		if err != nil {
			http.Error(w, "Failed to get ratings", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(ratings)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func notificationsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		var notification model.Notification
		if err := json.NewDecoder(r.Body).Decode(&notification); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		notification.ID = gocql.TimeUUID()
		if err := db.InsertNotification(notification); err != nil {
			http.Error(w, "Failed to insert notification", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(notification)
	case http.MethodGet:
		notifications, err := db.GetNotifications()
		if err != nil {
			http.Error(w, "Failed to get notifications", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(notifications)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func savedItemsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		var savedItem model.SavedItem
		if err := json.NewDecoder(r.Body).Decode(&savedItem); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		savedItem.ID = gocql.TimeUUID()
		if err := db.InsertSavedItem(savedItem); err != nil {
			http.Error(w, "Failed to insert saved item", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(savedItem)
	case http.MethodGet:
		savedItems, err := db.GetSavedItems()
		if err != nil {
			http.Error(w, "Failed to get saved items", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(savedItems)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func paymentsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		var payment model.Payment
		if err := json.NewDecoder(r.Body).Decode(&payment); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		payment.ID = gocql.TimeUUID()
		if err := db.InsertPayment(payment); err != nil {
			http.Error(w, "Failed to insert payment", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(payment)
	case http.MethodGet:
		payments, err := db.GetPayments()
		if err != nil {
			http.Error(w, "Failed to get payments", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(payments)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
