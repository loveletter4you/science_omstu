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
	err := ar.storage.db.QueryRow(query).Scan(&author.Id, &author.Name, &author.Surname, &author.Patronymic, &author.UserID)
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

func (ar *AuthorRepository) GetAuthorIdentifiers(author *model.Author) ([]*model.AuthorIdentifier, error) {
	authorIdentifiers := make([]*model.AuthorIdentifier, 0)
	query := fmt.Sprintf("SELECT author_identifier.id , author_identifier.author_id, "+
		"author_identifier.identifier_id, author_identifier.identifier, identifiers.name "+
		"FROM author_identifier, identifiers "+
		"WHERE author_id = %d AND author_identifier.identifier_id = identifiers.id", author.Id)
	rows, err := ar.storage.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		authorIdentifier := &model.AuthorIdentifier{}
		if err := rows.Scan(&authorIdentifier.Id, &authorIdentifier.AuthorId, &authorIdentifier.IdentifierId,
			&authorIdentifier.Identifier, &authorIdentifier.IdentifierName); err != nil {
			return nil, err
		}
		authorIdentifiers = append(authorIdentifiers, authorIdentifier)
	}
	return authorIdentifiers, nil
}

func (ar *AuthorRepository) GetAuthorWithIdentifiersById(id int) (*model.Author,
	[]*model.AuthorIdentifier, error) {
	var author *model.Author
	var authorIdentifiers []*model.AuthorIdentifier
	var err error
	author, err = ar.GetAuthorById(id)
	if err != nil {
		return nil, nil, err
	}
	authorIdentifiers, err = ar.GetAuthorIdentifiers(author)
	if err != nil {
		return nil, nil, err
	}
	return author, authorIdentifiers, nil
}
