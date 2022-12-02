package storage

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/model"
)

type AuthorRepository struct {
	storage *Storage
}

func (ar *AuthorRepository) GetAuthorById(id int) (*model.Author, error) {
	author := &model.Author{}
	query := fmt.Sprintf("SELECT id, name, surname, patronymic, user_id FROM authors WHERE id = %d", id)
	err := ar.storage.db.QueryRow(query).Scan(&author.Id, &author.Surname, &author.Name, &author.UserID)
	return author, err
}

func (ar *AuthorRepository) AddAuthor(author *model.Author) error {
	query := fmt.Sprintf("INSERT INTO authors (name, surname, patronymic) VALUES ('%s', '%s', '%s') RETURNING id",
		author.Name, author.Surname, author.Patronymic)
	err := ar.storage.db.QueryRow(query).Scan(&author.Id)
	return err
}

func (ar *AuthorRepository) AddAuthorIdentifier(authorIdentifier *model.AuthorIdentifier) error {
	query := fmt.Sprintf("INSERT INTO author_identifier (author_id, identifier_id, identifier) "+
		"VALUES (%d, %d, '%s') RETURNING id",
		authorIdentifier.AuthorId, authorIdentifier.IdentifierId, authorIdentifier.Identifier)
	err := ar.storage.db.QueryRow(query).Scan(&authorIdentifier.Id)
	return err
}
