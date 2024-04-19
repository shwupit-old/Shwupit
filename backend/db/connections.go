package db

import (
	"github.com/gocql/gocql"
	"log"
)


var session *gocql.Session

func init() {
	var err error
	cluster := gocql.NewCluster("127.0.0.1:9042")
	cluster.Consistency = gocql.All
	session, err = cluster.CreateSession()
	if err != nil {
		log.Fatalf("Could not connect to Cassandra : %v", err)
	}
	defer session.Close()

	keyspace_exsits := checkIfKeyspaceExists(session)
	if keyspace_exsits {
		cluster.Keyspace = "swap_platform"
	} else {
		CreateKeyspace(session)
		cluster.Keyspace = "swap_platform"
	}
	session, err = gocql.NewSession(*cluster)
	if err != nil {
		log.Fatalf("Could not connect to Cassandra : %v", err)
	}
}