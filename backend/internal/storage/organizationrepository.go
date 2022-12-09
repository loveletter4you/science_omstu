package storage

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/model"
)

type OrganizationRepository struct {
	storage *Storage
}

func (or *OrganizationRepository) AddOrganization(organization *model.Organization) error {
	query := fmt.Sprintf("INSERT INTO organizations (name, country, city) VALUES ('%s', '%s', '%s') RETURNING id",
		organization.Name, organization.Country, organization.City)
	err := or.storage.db.QueryRow(query).Scan(&organization.Id)
	return err
}

func (or *OrganizationRepository) AddAuthorPublicationOrganization(authorOrganization *model.AuthorPublicationOrganization) error {
	query := fmt.Sprintf("INSERT INTO author_publication_organization (author_publication_id, organization_id) VALUES (%d, %d) RETURNING id",
		authorOrganization.AuthorPublication.Id, authorOrganization.Organization.Id)
	err := or.storage.db.QueryRow(query).Scan(authorOrganization.Id)
	return err
}
