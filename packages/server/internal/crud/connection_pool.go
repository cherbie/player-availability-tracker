package crud

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type (
	ConnectionOpts struct {
		Uri string
	}

	Disposable interface {
		Close() error
	}

	ConnectionPool interface {
		Disposable
		Get() (*Connection, error)
		Connect(opts ConnectionOpts) error
	}

	InMemoryPool struct {
		resources []*Connection
	}
)

func NewInMemoryPool() ConnectionPool {
	return &InMemoryPool{make([]*Connection, 0)}
}

func (pool *InMemoryPool) Get() (*Connection, error) {
	if len(pool.resources) == 0 {
		return nil, errors.New("empty connection pool")
	}
	conn := pool.resources[len(pool.resources)-1]
	return conn, nil
}

func (pool *InMemoryPool) Connect(opts ConnectionOpts) error {
	client, err := connectToMongoClient(opts.Uri)
	if err != nil {
		return err
	}

	connection := NewConnection(client)
	pool.resources = append(pool.resources, connection)

	return nil
}

func (pool *InMemoryPool) Close() error {
	errList := make([]error, 0)
	for _, conn := range pool.resources {
		errList = append(errList, conn.Close())
	}
	return errors.Join(errList...)
}

func connectToMongoClient(uri string) (*mongo.Client, error) {
	client, err := mongo.Connect(context.Background(), makeMongoClientConfig(uri))
	if err != nil {
		return nil, err
	}

	// test connection
	if err := client.Ping(context.Background(), readpref.Primary()); err != nil {
		return nil, err
	}

	return client, err
}

func makeMongoClientConfig(uri string) *options.ClientOptions {
	return options.Client().ApplyURI(uri)
}

type mockConnectionPool struct {
	conn *Connection
}

func NewConnectionPoolMock(conn *Connection) ConnectionPool {
	return &mockConnectionPool{conn}
}

func (p *mockConnectionPool) Get() (*Connection, error) {
	return p.conn, nil
}

func (p *mockConnectionPool) Connect(ConnectionOpts) error {
	return nil
}

func (p *mockConnectionPool) Close() error {
	return nil
}
