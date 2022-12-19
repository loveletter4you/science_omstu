package storage

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/model"
)

type PublicationRepository struct {
	storage *Storage
}

func (pr *PublicationRepository) GetPublications(page int, limit int) ([]*model.Publication, error) {
	offset := page * limit
	authors := make([]*model.Publication, 0)
	query := fmt.Sprintf("SELECT id, title, abstract, publication_date FROM publications OFFSET %d LIMIT %d",
		offset, limit)
	rows, err := pr.storage.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		publication := &model.Publication{}
		if err := rows.Scan(&publication.Id, &publication.Title, &publication.Abstract, &publication.PublicationDate); err != nil {
			return nil, err
		}
		authors = append(authors, publication)
	}
	return authors, nil
}

func (pr *PublicationRepository) AddPublication(publication *model.Publication) error {
	query := fmt.Sprintf("INSERT INTO publications (type_id, source_id, title, abstract, publication_date) VALUES (%d, %d, $$%s$$, $$%s$$, $$%s$$) RETURNING id",
		publication.Type.Id, publication.Source.Id, publication.Title, publication.Abstract,
		publication.PublicationDate.Format("2006-01-02"))
	err := pr.storage.db.QueryRow(query).Scan(&publication.Id)
	return err
}

func (pr *PublicationRepository) AddAuthorPublication(authorPublication *model.AuthorPublication) error {
	query := fmt.Sprintf("INSERT INTO author_publication (author_id, publication_id) VALUES (%d, %d) RETURNING id",
		authorPublication.Author.Id, authorPublication.Publication.Id)
	err := pr.storage.db.QueryRow(query).Scan(&authorPublication.Id)
	return err
}

func (pr *PublicationRepository) AddPublicationLink(link *model.PublicationLink) error {
	query := fmt.Sprintf("INSERT INTO publication_link (publication_id, link_type_id, link) VALUES (%d, %d, $$%s$$) RETURNING id",
		link.Publication.Id, link.LinkType.Id, link.Link)
	err := pr.storage.db.QueryRow(query).Scan(&link.Id)
	return err
}

func (pr *PublicationRepository) AddPublicationLinkType(linkType *model.PublicationLinkType) error {
	query := fmt.Sprintf("INSERT INTO publication_links_type (name) VALUES ('%s') RETURNING id", linkType.Name)
	err := pr.storage.db.QueryRow(query).Scan(&linkType.Id)
	return err
}

func (pr *PublicationRepository) AddPublicationType(publicationType *model.PublicationType) error {
	query := fmt.Sprintf("SELECT EXISTS(SELECT FROM publication_types WHERE name = '%s')", publicationType.Name)
	var exist bool
	err := pr.storage.db.QueryRow(query).Scan(&exist)
	if err != nil {
		return err
	}
	if exist {
		query = fmt.Sprintf("SELECT id FROM publication_types WHERE name = '%s' LIMIT 1", publicationType.Name)
		err := pr.storage.db.QueryRow(query).Scan(&publicationType.Id)
		return err
	} else {
		query = fmt.Sprintf("INSERT INTO publication_types (name) VALUES ('%s') RETURNING id",
			publicationType.Name)
		err := pr.storage.db.QueryRow(query).Scan(&publicationType.Id)
		return err
	}
}
