package storage

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/model"
)

type SourceRepository struct {
	storage *Storage
}

func (sr *SourceRepository) AddSource(source *model.Source) error {
	query := fmt.Sprintf("INSERT INTO sources (source_type_id, name) VALUES (%d, '%s') RETURNING id",
		source.SourceType.Id, source.Name)
	err := sr.storage.db.QueryRow(query).Scan(&source.Id)
	return err
}

func (sr *SourceRepository) AddSourceType(sourceType *model.SourceType) error {
	query := fmt.Sprintf("INSERT INTO source_type (name) VALUES ('%s') RETURNING id", sourceType.Name)
	err := sr.storage.db.QueryRow(query).Scan(&sourceType.Id)
	return err
}

func (sr *SourceRepository) GetSourceTypeByName(name string) (*model.SourceType, error) {
	sourceType := &model.SourceType{}
	query := fmt.Sprintf("SELECT id, name FROM source_type WHERE name = '%s'", name)
	err := sr.storage.db.QueryRow(query).Scan(&sourceType.Id, &sourceType.Name)
	return sourceType, err
}
