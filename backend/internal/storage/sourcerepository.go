package storage

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/model"
)

type SourceRepository struct {
	storage *Storage
}

func (sr *SourceRepository) GetSourceIfExist(source *model.Source) (bool, error) {
	query := fmt.Sprintf("SELECT EXISTS(SELECT FROM sources WHERE name = '%s')", source.Name)
	var exist string
	err := sr.storage.db.QueryRow(query).Scan(&exist)
	if err != nil {
		return false, err
	}
	if exist == "true" {
		query = fmt.Sprintf("SELECT id FROM sources WHERE name = '%s' LIMIT 1", source.Name)
		err := sr.storage.db.QueryRow(query).Scan(&source.Id)
		return true, err
	}
	return false, nil
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

func (sr *SourceRepository) AddSourceLinkType(linkType *model.SourceLinkType) error {
	query := fmt.Sprintf("INSERT INTO sources_link_type (name) VALUES ('%s') RETURNING id", linkType.Name)
	err := sr.storage.db.QueryRow(query).Scan(&linkType.Id)
	return err
}

func (sr *SourceRepository) AddSourceLink(link *model.SourceLink) error {
	query := fmt.Sprintf("INSERT INTO source_link (source_id, source_link_type_id, link) VALUES (%d, %d, '%s') RETURNING id",
		link.Source.Id, link.SourceLinkType.Id, link.Link)
	err := sr.storage.db.QueryRow(query).Scan(&link.Id)
	return err
}

func (sr *SourceRepository) GetSourceTypeByName(name string) (*model.SourceType, error) {
	sourceType := &model.SourceType{}
	query := fmt.Sprintf("SELECT id, name FROM source_type WHERE name = '%s'", name)
	err := sr.storage.db.QueryRow(query).Scan(&sourceType.Id, &sourceType.Name)
	return sourceType, err
}
