package db

import (
	"fmt"
	"log"

	"github.com/gocql/gocql"
)

func initSession() (*gocql.Session, error) {
	cluster := gocql.NewCluster("127.0.0.1:9042")
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

func CreateSwappersTable(session *gocql.Session) {
	cql := `CREATE TABLE IF NOT EXISTS swappers (
		swapper_id UUID PRIMARY KEY,
		username TEXT,
		email TEXT,
		location TEXT,
		swapping_history LIST<TEXT>,
		availability TEXT,
		profile_picture TEXT,
		account_creation_date TIMESTAMP
	);`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table created successfully")

}

func CreateTableProducts(session *gocql.Session) {
	cql := `CREATE TABLE IF NOT EXISTS products (
		product_id UUID PRIMARY KEY,
		product_name TEXT,
		product_type TEXT,
		product_description TEXT,
		product_price DECIMAL,
		product_image TEXT,
		product_tags SET<TEXT>,
		product_start_date TIMESTAMP,
		product_end_date TIMESTAMP,
		swapper_id UUID
	);
	`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table created successfully")
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
	);
	`

	if err := session.Query(cql).Exec(); err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	fmt.Println("Table created successfully")
}

func checkIfKeyspaceExists(session *gocql.Session) bool {
	var name, durableWrites, strategyClass string
	var strategyOptions map[string]interface{}

	query := `SELECT keyspace_name, durable_writes, strategy_class, strategy_options FROM system_schema.keyspaces WHERE keyspace_name = ?`
	if err := session.Query(query, "swap_platform").Scan(&name, &durableWrites, &strategyClass, &strategyOptions); err != nil {
		log.Printf("Failed to retrieve keyspace: %v", err)
		return false
	}
	fmt.Printf("Keyspace: %s, DurableWrites: %s, StrategyClass: %s, StrategyOptions: %v\n", name, durableWrites, strategyClass, strategyOptions)
	return true
}

func StartDatabase() {
	var err error
	session, err := initSession()
	if err != nil {
		log.Fatalf("Could not connect to Cassandra: %v", err)
	}

	CreateKeyspace(session)
	CreateSwappersTable(session)
	CreateTableProducts(session)
	CreateImagesTable(session)
}
