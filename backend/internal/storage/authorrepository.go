package storage

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/model"
)

type AuthorRepository struct {
	storage *Storage
}

//здесь непосредственно все запросы, если селект запросы - возвращаем ссылку на объект(ы) которые получаем
//инсерт запросы - заполняем все необходимые поля, и получаем айдишник, который записываем в тот же объект

func (ar *AuthorRepository) GetAuthorById(id int) (*model.Author, error) {
	author := &model.Author{}
	query := fmt.Sprintf("SELECT id, name, surname, patronymic, user_id FROM authors WHERE id = %d", id)
	err := ar.storage.db.QueryRow(query).Scan(&author.Id, &author.Name, &author.Surname, &author.Patronymic, &author.UserID)
	return author, err
}

func (ar *AuthorRepository) AddAuthor(author *model.Author) error {
	query := fmt.Sprintf("INSERT INTO authors (name, surname, patronymic) VALUES ($$%s$$, $$%s$$, $$%s$$) RETURNING id",
		author.Name, author.Surname, author.Patronymic)
	err := ar.storage.db.QueryRow(query).Scan(&author.Id)
	return err
}

func (ar *AuthorRepository) GetAuthorIdentifierIfExist(authorIdentifier *model.AuthorIdentifier) (bool, error) {
	query := fmt.Sprintf("SELECT EXISTS(SELECT FROM author_identifier WHERE identifier = '%s')", authorIdentifier.IdentifierValue)
	var exist string
	err := ar.storage.db.QueryRow(query).Scan(&exist)
	if err != nil {
		return false, err
	}
	if exist == "true" {
		query = fmt.Sprintf("SELECT id, author_id FROM author_identifier WHERE identifier = '%s' LIMIT 1", authorIdentifier.IdentifierValue)
		err := ar.storage.db.QueryRow(query).Scan(&authorIdentifier.Id, &authorIdentifier.Author.Id)
		return true, err
	} else {
		return false, nil
	}
}

func (ar *AuthorRepository) AddAuthorIdentifier(authorIdentifier *model.AuthorIdentifier) error {
	query := fmt.Sprintf("INSERT INTO author_identifier (author_id, identifier_id, identifier) "+
		"VALUES (%d, %d, '%s') RETURNING id",
		authorIdentifier.Author.Id, authorIdentifier.Identifier.Id, authorIdentifier.IdentifierValue)
	err := ar.storage.db.QueryRow(query).Scan(&authorIdentifier.Id)
	return err
}

func (ar *AuthorRepository) GetAuthorIdentifiers(author *model.Author) ([]*model.AuthorIdentifier, error) {
	authorIdentifiers := make([]*model.AuthorIdentifier, 0)
	query := fmt.Sprintf("SELECT author_identifier.id , "+
		"author_identifier.identifier_id, author_identifier.identifier, identifiers.name "+
		"FROM author_identifier, identifiers "+
		"WHERE author_id = %d AND author_identifier.identifier_id = identifiers.id", author.Id)
	rows, err := ar.storage.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		authorIdentifier := &model.AuthorIdentifier{
			Identifier: &model.Identifier{},
		}
		if err := rows.Scan(&authorIdentifier.Id, &authorIdentifier.Identifier.Id,
			&authorIdentifier.IdentifierValue, &authorIdentifier.Identifier.Name); err != nil {
			return nil, err
		}
		authorIdentifiers = append(authorIdentifiers, authorIdentifier)
	}
	return authorIdentifiers, nil
}

func (ar *AuthorRepository) GetAuthors(page int, limit int) ([]*model.Author, error) {
	offset := page * limit
	authors := make([]*model.Author, 0)
	query := fmt.Sprintf("SELECT id, name, surname, patronymic, user_id FROM authors OFFSET %d LIMIT %d",
		offset, limit)
	rows, err := ar.storage.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		author := &model.Author{}
		if err := rows.Scan(&author.Id, &author.Name, &author.Surname, &author.Patronymic, &author.UserID); err != nil {
			return nil, err
		}
		authors = append(authors, author)
	}
	return authors, nil
}

func (ar *AuthorRepository) GetAuthorsCount() (int, error) {
	var count int
	query := "SELECT count(*) FROM authors"
	err := ar.storage.db.QueryRow(query).Scan(&count)
	return count, err
}
