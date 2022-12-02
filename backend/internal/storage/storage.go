package storage

import (
	"database/sql"
	_ "github.com/lib/pq"
)

type Storage struct {
	config               *Config
	db                   *sql.DB
	authorRepository     *AuthorRepository
	identifierRepository *IdentifierRepository
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

	s.db = db

	return nil
}

func (s *Storage) Close() {
	s.db.Close()
}

func (s *Storage) Author() *AuthorRepository {
	if s.authorRepository != nil {
		return s.authorRepository
	}

	s.authorRepository = &AuthorRepository{
		storage: s,
	}

	return s.authorRepository
}

func (s *Storage) Identifier() *IdentifierRepository {
	if s.identifierRepository != nil {
		return s.identifierRepository
	}

	s.identifierRepository = &IdentifierRepository{
		storage: s,
	}

	return s.identifierRepository
}
