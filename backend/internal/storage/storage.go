package storage

import (
	"database/sql"
	_ "github.com/lib/pq"
)

type Storage struct {
	config *Config
	Db     *sql.DB
}

func NewStorage(config *Config) *Storage {
	return &Storage{
		config: config,
	}
}

func (s *Storage) Open() error {
	db, err := sql.Open("postgres", s.config.DataBaseURL)
	if err != nil {
		return err
	}

	// ping for check to connect
	if err := db.Ping(); err != nil {
		return err
	}

	s.Db = db

	return nil
}

func (s *Storage) Close() {
	s.Db.Close()
}
