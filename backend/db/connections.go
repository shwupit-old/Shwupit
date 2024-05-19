package db

import (
	"fmt"

	"github.com/gocql/gocql"
)

func Init() (*gocql.Session, error) {
	cluster := gocql.NewCluster("127.0.0.1:9042")
	cluster.Consistency = gocql.All

	session, err := cluster.CreateSession()
	if err != nil {
		return nil, fmt.Errorf("could not connect to Cassandra: %v", err)
	}

	keyspaceExists := checkIfKeyspaceExists(session)
	if !keyspaceExists {
		err = createKeyspace(session)
		if err != nil {
			return nil, err
		}
		cluster.Keyspace = "swap_platform"
	}

	session, err = cluster.CreateSession()
	if err != nil {
		return nil, fmt.Errorf("could not connect to Cassandra: %v", err)
	}
	return session, nil
}

func checkIfKeyspaceExists(session *gocql.Session) bool {
	query := `SELECT keyspace_name FROM system_schema.keyspaces WHERE keyspace_name='swap_platform'`
	iter := session.Query(query).Iter()
	defer iter.Close()
	return iter.NumRows() > 0
}

func createKeyspace(session *gocql.Session) error {
	query := `CREATE KEYSPACE swap_platform WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1}`
	return session.Query(query).Exec()
}
