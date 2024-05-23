package db

import (
	"api/model"
	"crypto/sha1"
	"fmt"
	"log"

	"github.com/gocql/gocql"
	"golang.org/x/crypto/bcrypt"
)

var session *gocql.Session

func init() {
	var err error
	session, err = initSession()
	if err != nil {
		log.Fatalf("Could not connect to Cassandra: %v", err)
	}
}

func InsertUser(user model.User) error {
	query := `INSERT INTO users (
		user_id, username, email, password_hash, first_name, last_name, country, 
		profile_picture_url, user_rating, payment_details, created_at, updated_at, 
		saved_items, currency, bio
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	err := session.Query(query,
		user.ID,
		user.Username,
		user.Email,
		user.PasswordHash,
		user.FirstName,
		user.LastName,
		user.Country,
		user.ProfilePictureURL,
		user.UserRating,
		user.PaymentDetails,
		user.CreatedAt,
		user.UpdatedAt,
		user.SavedItems,
		user.Currency,
		user.Bio,
	).Exec()
	if err != nil {
		log.Printf("Failed to execute query: %v", err)
		return fmt.Errorf("failed to execute query: %w", err)
	}

	return nil
}

func GetUserByUsernameOrEmail(identifier string) (model.User, error) {
	var user model.User
	cql := `SELECT user_id, username, email, password_hash, first_name, last_name, country, 
			profile_picture_url, user_rating, payment_details, created_at, updated_at, 
			saved_items, currency, bio 
			FROM users WHERE username = ? OR email = ? LIMIT 1`
	err := session.Query(cql, identifier, identifier).Scan(
		&user.ID, &user.Username, &user.Email, &user.PasswordHash, &user.FirstName, &user.LastName,
		&user.Country, &user.ProfilePictureURL, &user.UserRating, &user.PaymentDetails,
		&user.CreatedAt, &user.UpdatedAt, &user.SavedItems, &user.Currency, &user.Bio,
	)
	return user, err
}

func InsertItem(item model.Item) error {
	cql := `INSERT INTO items (item_id, user_id, item_photo, item_name, description, price, country, city, subcategory, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	return session.Query(cql, item.ID, item.UserID, item.ItemPhoto, item.ItemName, item.Description, item.Price, item.Country, item.City, item.Subcategory, item.Category, item.CreatedAt, item.UpdatedAt).Exec()
}

func GetItems() ([]model.Item, error) {
	var items []model.Item
	iter := session.Query(`SELECT item_id, user_id, item_photo, item_name, description, price, country, city, subcategory, category, created_at, updated_at FROM items`).Iter()
	var item model.Item
	for iter.Scan(&item.ID, &item.UserID, &item.ItemPhoto, &item.ItemName, &item.Description, &item.Price, &item.Country, &item.City, &item.Subcategory, &item.Category, &item.CreatedAt, &item.UpdatedAt) {
		items = append(items, item)
	}
	if err := iter.Close(); err != nil {
		return nil, err
	}
	return items, nil
}

func InsertDispute(dispute model.Dispute) error {
	cql := `INSERT INTO disputes (dispute_id, swap_id, user_id, counterparty_user_id, dispute_reason, dispute_status, dispute_details, created_at, updated_at, resolved_by, resolution_details, resolution_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	return session.Query(cql, dispute.ID, dispute.SwapID, dispute.UserID, dispute.CounterpartyUserID, dispute.DisputeReason, dispute.DisputeStatus, dispute.DisputeDetails, dispute.CreatedAt, dispute.UpdatedAt, dispute.ResolvedBy, dispute.ResolutionDetails, dispute.ResolutionDate).Exec()
}

func GetDisputes() ([]model.Dispute, error) {
	var disputes []model.Dispute
	iter := session.Query(`SELECT dispute_id, swap_id, user_id, counterparty_user_id, dispute_reason, dispute_status, dispute_details, created_at, updated_at, resolved_by, resolution_details, resolution_date FROM disputes`).Iter()
	var dispute model.Dispute
	for iter.Scan(&dispute.ID, &dispute.SwapID, &dispute.UserID, &dispute.CounterpartyUserID, &dispute.DisputeReason, &dispute.DisputeStatus, &dispute.DisputeDetails, &dispute.CreatedAt, &dispute.UpdatedAt, &dispute.ResolvedBy, &dispute.ResolutionDetails, &dispute.ResolutionDate) {
		disputes = append(disputes, dispute)
	}
	if err := iter.Close(); err != nil {
		return nil, err
	}
	return disputes, nil
}

func InsertSwap(swap model.Swap) error {
	cql := `INSERT INTO swaps (swap_id, user_id, counterparty_user_id, item_id, counterparty_item_id, swap_status, swap_value, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	return session.Query(cql, swap.ID, swap.UserID, swap.CounterpartyUserID, swap.ItemID, swap.CounterpartyItemID, swap.SwapStatus, swap.SwapValue, swap.CreatedAt, swap.UpdatedAt).Exec()
}

func GetSwaps() ([]model.Swap, error) {
	var swaps []model.Swap
	iter := session.Query(`SELECT swap_id, user_id, counterparty_user_id, item_id, counterparty_item_id, swap_status, swap_value, created_at, updated_at FROM swaps`).Iter()
	var swap model.Swap
	for iter.Scan(&swap.ID, &swap.UserID, &swap.CounterpartyUserID, &swap.ItemID, &swap.CounterpartyItemID, &swap.SwapStatus, &swap.SwapValue, &swap.CreatedAt, &swap.UpdatedAt) {
		swaps = append(swaps, swap)
	}
	if err := iter.Close(); err != nil {
		return nil, err
	}
	return swaps, nil
}

func InsertSwapRequest(swapRequest model.SwapRequest) error {
	cql := `INSERT INTO swap_requests (request_id, swap_id, request_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
	return session.Query(cql, swapRequest.ID, swapRequest.SwapID, swapRequest.RequestStatus, swapRequest.CreatedAt, swapRequest.UpdatedAt).Exec()
}

func GetSwapRequests() ([]model.SwapRequest, error) {
	var swapRequests []model.SwapRequest
	iter := session.Query(`SELECT request_id, swap_id, request_status, created_at, updated_at FROM swap_requests`).Iter()
	var swapRequest model.SwapRequest
	for iter.Scan(&swapRequest.ID, &swapRequest.SwapID, &swapRequest.RequestStatus, &swapRequest.CreatedAt, &swapRequest.UpdatedAt) {
		swapRequests = append(swapRequests, swapRequest)
	}
	if err := iter.Close(); err != nil {
		return nil, err
	}
	return swapRequests, nil
}

func InsertRating(rating model.Rating) error {
	cql := `INSERT INTO ratings (rating_id, swap_id, reviewer_id, reviewee_id, rating, review_text, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
	return session.Query(cql, rating.ID, rating.SwapID, rating.ReviewerID, rating.RevieweeID, rating.Rating, rating.ReviewText, rating.CreatedAt).Exec()
}

func GetRatings() ([]model.Rating, error) {
	var ratings []model.Rating
	iter := session.Query(`SELECT rating_id, swap_id, reviewer_id, reviewee_id, rating, review_text, created_at FROM ratings`).Iter()
	var rating model.Rating
	for iter.Scan(&rating.ID, &rating.SwapID, &rating.ReviewerID, &rating.RevieweeID, &rating.Rating, &rating.ReviewText, &rating.CreatedAt) {
		ratings = append(ratings, rating)
	}
	if err := iter.Close(); err != nil {
		return nil, err
	}
	return ratings, nil
}

func InsertNotification(notification model.Notification) error {
	cql := `INSERT INTO notifications (notification_id, user_id, notification_type, notification_text, read_status, created_at) VALUES (?, ?, ?, ?, ?, ?)`
	return session.Query(cql, notification.ID, notification.UserID, notification.NotificationType, notification.NotificationText, notification.ReadStatus, notification.CreatedAt).Exec()
}

func GetNotifications() ([]model.Notification, error) {
	var notifications []model.Notification
	iter := session.Query(`SELECT notification_id, user_id, notification_type, notification_text, read_status, created_at FROM notifications`).Iter()
	var notification model.Notification
	for iter.Scan(&notification.ID, &notification.UserID, &notification.NotificationType, &notification.NotificationText, &notification.ReadStatus, &notification.CreatedAt) {
		notifications = append(notifications, notification)
	}
	if err := iter.Close(); err != nil {
		return nil, err
	}
	return notifications, nil
}

func InsertSavedItem(savedItem model.SavedItem) error {
	cql := `INSERT INTO saved_items (saved_item_id, user_id, item_id, item_details, saved_at) VALUES (?, ?, ?, ?, ?)`
	return session.Query(cql, savedItem.ID, savedItem.UserID, savedItem.ItemID, savedItem.ItemDetails, savedItem.SavedAt).Exec()
}

func GetSavedItems() ([]model.SavedItem, error) {
	var savedItems []model.SavedItem
	iter := session.Query(`SELECT saved_item_id, user_id, item_id, item_details, saved_at FROM saved_items`).Iter()
	var savedItem model.SavedItem
	for iter.Scan(&savedItem.ID, &savedItem.UserID, &savedItem.ItemID, &savedItem.ItemDetails, &savedItem.SavedAt) {
		savedItems = append(savedItems, savedItem)
	}
	if err := iter.Close(); err != nil {
		return nil, err
	}
	return savedItems, nil
}

func InsertPayment(payment model.Payment) error {
	cql := `INSERT INTO payments (payment_id, swap_id, user_id, counterparty_user_id, payment_amount, payment_status, stripe_payment_intent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	return session.Query(cql, payment.ID, payment.SwapID, payment.UserID, payment.CounterpartyUserID, payment.PaymentAmount, payment.PaymentStatus, payment.StripePaymentIntentID, payment.CreatedAt, payment.UpdatedAt).Exec()
}

func GetPayments() ([]model.Payment, error) {
	var payments []model.Payment
	iter := session.Query(`SELECT payment_id, swap_id, user_id, counterparty_user_id, payment_amount, payment_status, stripe_payment_intent_id, created_at, updated_at FROM payments`).Iter()
	var payment model.Payment
	for iter.Scan(&payment.ID, &payment.SwapID, &payment.UserID, &payment.CounterpartyUserID, &payment.PaymentAmount, &payment.PaymentStatus, &payment.StripePaymentIntentID, &payment.CreatedAt, &payment.UpdatedAt) {
		payments = append(payments, payment)
	}
	if err := iter.Close(); err != nil {
		return nil, err
	}
	return payments, nil
}

func InsertImage(image model.Image) error {
	cql := `INSERT INTO images (hash, name, imageDescription, imagePath, created, updated, deleted) VALUES (?, ?, ?, ?, ?, ?, ?)`
	return session.Query(cql, image.Hash, image.Name, image.ImageDescription, image.ImagePath, image.Created, image.Updated, image.Deleted).Exec()
}

func GenerateHash(filename string) string {
	h := sha1.New()
	h.Write([]byte(filename))
	bs := h.Sum(nil)
	return fmt.Sprintf("%x", bs)
}

// VerifyPassword verifies if the given password matches the hashed password
func VerifyPassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
