package filldb

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/model"
	"github.com/loveletter4u/cris/internal/storage"
	"io"
	"log"
	"time"
)

func PublicationFill(reader io.Reader, storage *storage.Storage) error {
	publications, err := storage.Publication().GetPublications(0, 1)
	if err != nil {
		return err
	}
	if len(publications) != 0 {
		log.Print("Publication exists")
		return nil
	}
	err = publicationScopusFill(reader, storage)
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
	for _, row := range dataSet {
		date, err := time.Parse("2006", row["Year"])
		if err != nil {
			return err
		}
		publication := &model.Publication{
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
		fmt.Println(publication)
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
	}
	return nil
}
