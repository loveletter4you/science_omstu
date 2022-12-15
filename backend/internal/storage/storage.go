package storage

import (
	"database/sql"
	_ "github.com/lib/pq"
)

// Структура сторага, тут подключаемся к базе данных и пишем туда запросики

type Storage struct {
	config                *Config
	db                    *sql.DB
	authorRepository      *AuthorRepository
	identifierRepository  *IdentifierRepository
	publicationRepository *PublicationRepository
}

func NewStorage(config *Config) *Storage {
	return &Storage{
		config: config,
	}
}

//открываем подключение по данным из конфига

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

//подключаем репозитории, в которых выполняем запросики в базу данных (подробнее в authorrepository.go)
//репозитории - дополнительный уровень абстракции для более удобного разделения логики работы с базой данных

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

func (s *Storage) Publication() *PublicationRepository {
	if s.publicationRepository != nil {
		return s.publicationRepository
	}

	s.publicationRepository = &PublicationRepository{
		storage: s,
	}

	return s.publicationRepository
}
