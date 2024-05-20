package db

import (
	"fmt"
	"log"

	"github.com/gocql/gocql"
)

func initSession() (*gocql.Session, error) {
	cluster := gocql.NewCluster("127.0.0.1")
	cluster.Keyspace = "swap_platform"
	cluster.Consistency = gocql.All
	session, err := cluster.CreateSession()
	if err != nil {
		log.Printf("Could not connect to Cassandra: %v", err)
		return nil, err
	}
	return session, nil
}

func CreateKeyspace(session *gocql.Session) {
	cql := `CREATE KEYSPACE IF NOT EXISTS swap_platform
		WITH REPLICATION = {
			'class' : 'SimpleStrategy',
			'replication_factor' : 1
		};`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create keyspace: %v", err)
	}
	fmt.Println("Keyspace created successfully")
}

func CreateUsersTable(session *gocql.Session) {
	cql := `CREATE TABLE IF NOT EXISTS users (
		user_id UUID PRIMARY KEY,
		username TEXT,
		email TEXT,
		password_hash TEXT,
		first_name TEXT,
		last_name TEXT,
		phone_number TEXT,
		profile_picture_url TEXT,
		user_rating DECIMAL,
		payment_details TEXT,
		created_at TIMESTAMP,
		updated_at TIMESTAMP,
		saved_items LIST<UUID>
	);`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table 'users' created successfully")
}

func CreateItemsTable(session *gocql.Session) {
	cql := `CREATE TABLE IF NOT EXISTS items (
		item_id UUID PRIMARY KEY,
		user_id UUID,
		item_photo TEXT,
		item_name TEXT,
		description TEXT,
		price DECIMAL,
		country TEXT,
		city TEXT,
		subcategory TEXT,
		category TEXT,
		created_at TIMESTAMP,
		updated_at TIMESTAMP
	);`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table 'items' created successfully")
}

func CreateDisputesTable(session *gocql.Session) {
	cql := `CREATE TABLE IF NOT EXISTS disputes (
		dispute_id UUID PRIMARY KEY,
		swap_id UUID,
		user_id UUID,
		counterparty_user_id UUID,
		dispute_reason TEXT,
		dispute_status TEXT,
		dispute_details TEXT,
		created_at TIMESTAMP,
		updated_at TIMESTAMP,
		resolved_by UUID,
		resolution_details TEXT,
		resolution_date TIMESTAMP
	);`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table 'disputes' created successfully")
}

func CreateSwapsTable(session *gocql.Session) {
	cql := `CREATE TABLE IF NOT EXISTS swaps (
		swap_id UUID PRIMARY KEY,
		user_id UUID,
		counterparty_user_id UUID,
		item_id UUID,
		counterparty_item_id UUID,
		swap_status TEXT,
		swap_value DECIMAL,
		created_at TIMESTAMP,
		updated_at TIMESTAMP
	);`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table 'swaps' created successfully")
}

func CreateSwapRequestsTable(session *gocql.Session) {
	cql := `CREATE TABLE IF NOT EXISTS swap_requests (
		request_id UUID PRIMARY KEY,
		swap_id UUID,
		request_status TEXT,
		created_at TIMESTAMP,
		updated_at TIMESTAMP
	);`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table 'swap_requests' created successfully")
}

func CreateRatingsTable(session *gocql.Session) {
	cql := `CREATE TABLE IF NOT EXISTS ratings (
		rating_id UUID PRIMARY KEY,
		swap_id UUID,
		reviewer_id UUID,
		reviewee_id UUID,
		rating DECIMAL,
		review_text TEXT,
		created_at TIMESTAMP
	);`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table 'ratings' created successfully")
}

func CreateNotificationsTable(session *gocql.Session) {
	cql := `CREATE TABLE IF NOT EXISTS notifications (
		notification_id UUID PRIMARY KEY,
		user_id UUID,
		notification_type TEXT,
		notification_text TEXT,
		read_status BOOLEAN,
		created_at TIMESTAMP
	);`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table 'notifications' created successfully")
}

func CreateSavedItemsTable(session *gocql.Session) {
	cql := `CREATE TABLE IF NOT EXISTS saved_items (
		saved_item_id UUID PRIMARY KEY,
		user_id UUID,
		item_id UUID,
		item_details TEXT,
		saved_at TIMESTAMP
	);`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table 'saved_items' created successfully")
}

func CreatePaymentsTable(session *gocql.Session) {
	cql := `CREATE TABLE IF NOT EXISTS payments (
		payment_id UUID PRIMARY KEY,
		swap_id UUID,
		user_id UUID,
		counterparty_user_id UUID,
		payment_amount DECIMAL,
		payment_status TEXT,
		stripe_payment_intent_id TEXT,
		created_at TIMESTAMP,
		updated_at TIMESTAMP
	);`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table 'payments' created successfully")
}

func CreateImagesTable(session *gocql.Session) {
	cql := `CREATE TABLE IF NOT EXISTS images (
		hash TEXT PRIMARY KEY,
		name TEXT,
		imageDescription TEXT,
		imagePath TEXT,
		created TIMESTAMP,
		updated TIMESTAMP,
		deleted TIMESTAMP
	);`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table 'images' created successfully")
}

func StartDatabase() {
	session, err := initSession()
	if err != nil {
		log.Fatalf("Could not connect to Cassandra: %v", err)
	}

	CreateKeyspace(session)
	CreateUsersTable(session)
	CreateItemsTable(session)
	CreateDisputesTable(session)
	CreateSwapsTable(session)
	CreateSwapRequestsTable(session)
	CreateRatingsTable(session)
	CreateNotificationsTable(session)
	CreateSavedItemsTable(session)
	CreatePaymentsTable(session)
	CreateImagesTable(session)
}
