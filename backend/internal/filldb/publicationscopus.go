package filldb

import (
	"github.com/loveletter4u/cris/internal/model"
	"github.com/loveletter4u/cris/internal/storage"
	"io"
	"log"
	"os"
	"strings"
	"time"
)

func PublicationFill(storage *storage.Storage) error {
	publications, err := storage.Publication().GetPublications(0, 1)
	if err != nil {
		return err
	}
	if len(publications) != 0 {
		log.Print("Publication exists")
		return nil
	}
	file, err := os.Open("/backend/resources/scopus18-22en.csv")
	if err != nil {
		return err
	}
	err = publicationScopusFill(file, storage)
	if err != nil {
		return err
	}
	return nil
}
func publicationScopusFill(reader io.Reader, storage *storage.Storage) error {
	dataSet := CSVToMap(reader)
	doi := &model.PublicationLinkType{Name: "DOI"}
	err := storage.Publication().AddPublicationLinkType(doi)
	if err != nil {
		return err
	}
	scopusLink := &model.PublicationLinkType{Name: "Scopus"}
	err = storage.Publication().AddPublicationLinkType(scopusLink)
	if err != nil {
		return err
	}
	typeJournal := &model.SourceType{Name: "Журнал"}
	err = storage.Source().AddSourceType(typeJournal)
	if err != nil {
		return err
	}
	typeConference := &model.SourceType{Name: "Конференция"}
	err = storage.Source().AddSourceType(typeConference)
	if err != nil {
		return err
	}
	sourceLinkISSN := &model.SourceLinkType{Name: "ISSN"}
	err = storage.Source().AddSourceLinkType(sourceLinkISSN)
	if err != nil {
		return err
	}
	scopusIdentifier, err := storage.Identifier().GetIdentifierByName("scopus")
	if err != nil {
		return err
	}
	for _, row := range dataSet {
		source := &model.Source{Name: row["Source title"]}
		if row["Document Type"] == "Conference Paper" {
			source.SourceType = typeConference
		} else {
			source.SourceType = typeJournal
		}
		exist, err := storage.Source().GetSourceIfExist(source)
		if err != nil {
			return err
		}
		if !exist {
			err = storage.Source().AddSource(source)
			if err != nil {
				return err
			}
			if row["ISSN"] != "" {
				sourceLink := &model.SourceLink{
					Source:         source,
					SourceLinkType: sourceLinkISSN,
					Link:           row["ISSN"],
				}
				err := storage.Source().AddSourceLink(sourceLink)
				if err != nil {
					return err
				}
			}
		}
		date, err := time.Parse("2006", row["Year"])
		if err != nil {
			return err
		}
		publicationType := &model.PublicationType{
			Name: row["Document Type"],
		}
		err = storage.Publication().AddPublicationType(publicationType)
		if err != nil {
			return err
		}
		publication := &model.Publication{
			Type:            publicationType,
			Source:          source,
			Title:           row["Title"],
			Abstract:        row["Abstract"],
			PublicationDate: date,
		}
		err = storage.Publication().AddPublication(publication)
		if err != nil {
			return err
		}
		linkScopus := &model.PublicationLink{
			Publication: publication,
			LinkType:    scopusLink,
			Link:        row["Link"],
		}
		err = storage.Publication().AddPublicationLink(linkScopus)
		if err != nil {
			return err
		}
		if row["DOI"] != "" {
			linkDoi := &model.PublicationLink{
				Publication: publication,
				LinkType:    doi,
				Link:        row["DOI"],
			}
			err = storage.Publication().AddPublicationLink(linkDoi)
			if err != nil {
				return err
			}
		}
		authorsAndOrg := strings.Split(row["Authors with affiliations"], ";")
		authorsScopus := strings.Split(row["Author(s) ID"], ";")
		for i, authorRow := range authorsAndOrg {
			author := &model.Author{}
			authorInfo := strings.Split(authorRow, ",")
			authorIdentifier := &model.AuthorIdentifier{
				Author: author,
				IdentifierValue: authorsScopus[i],
				Identifier: scopusIdentifier,
			}
			exist, err := storage.Author().GetAuthorIdentifierIfExist(authorIdentifier)
			if err != nil {
				return err
			}
			if !exist {
				author.Surname = authorInfo[0]
				author.Name = authorInfo[1]
				err := storage.Author().AddAuthor(author)
				if err != nil {
					return err
				}
				err = storage.Author().AddAuthorIdentifier(authorIdentifier)
				if err != nil {
					return err
				}
			}
			authorPublication := &model.AuthorPublication{
				Publication: publication,
				Author: authorIdentifier.Author,
			}
			err = storage.Publication().AddAuthorPublication(authorPublication)
			if err != nil {
				return err
			}
		}
	}
	return nil
}
