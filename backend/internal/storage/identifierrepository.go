package storage

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/model"
)

type IdentifierRepository struct {
	storage *Storage
}

func (ir *IdentifierRepository) GetIdentifierByName(name string) (*model.Identifier, error) {
	identifier := &model.Identifier{}
	query := fmt.Sprintf("SELECT id, name FROM identifiers WHERE name = '%s'", name)
	err := ir.storage.db.QueryRow(query).Scan(&identifier.Id, &identifier.Name)
	return identifier, err
}

func (ir *IdentifierRepository) AddIdentifier(identifier *model.Identifier) error {
	query := fmt.Sprintf("INSERT INTO identifiers (name) VALUES ('%s') RETURNING id", identifier.Name)
	err := ir.storage.db.QueryRow(query).Scan(&identifier.Id)
	return err
}
