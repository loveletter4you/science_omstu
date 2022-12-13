package filldb

import (
	"github.com/loveletter4u/cris/internal/model"
	"github.com/loveletter4u/cris/internal/storage"
	"io"
	"log"
)

func AuthorsFill(reader io.Reader, storage *storage.Storage) error {
	dataSet := CSVToMap(reader)
	authors, err := storage.Author().GetAuthors(0, 1)
	if err != nil {
		return err
	}
	if len(authors) != 0 {
		log.Print("Authors exists")
		return nil
	}

	spin := &model.Identifier{Name: "spin"}
	if err := storage.Identifier().AddIdentifier(spin); err != nil {
		return err
	}

	orcid := &model.Identifier{Name: "orcid"}
	if err := storage.Identifier().AddIdentifier(orcid); err != nil {
		return err
	}

	scopus := &model.Identifier{Name: "scopus"}
	if err := storage.Identifier().AddIdentifier(scopus); err != nil {
		return err
	}

	researcher := &model.Identifier{Name: "researcher"}
	if err := storage.Identifier().AddIdentifier(researcher); err != nil {
		return err
	}

	for _, row := range dataSet {
		author := &model.Author{
			Name:       row["name"],
			Surname:    row["surname"],
			Patronymic: row["patronymic"],
		}
		if err := storage.Author().AddAuthor(author); err != nil {
			return err
		}
		if row["spin"] != "0" && row["spin"] != "" {
			authorIdentifier := &model.AuthorIdentifier{
				Author:          author,
				Identifier:      spin,
				IdentifierValue: row["spin"],
			}
			if err := storage.Author().AddAuthorIdentifier(authorIdentifier); err != nil {
				return err
			}
		}
		if row["orcid"] != "0" && row["orcid"] != "" {
			authorIdentifier := &model.AuthorIdentifier{
				Author:          author,
				Identifier:      orcid,
				IdentifierValue: row["orcid"],
			}
			if err := storage.Author().AddAuthorIdentifier(authorIdentifier); err != nil {
				return err
			}
		}
		if row["scopus author id"] != "0" && row["scopus author id"] != "" {
			authorIdentifier := &model.AuthorIdentifier{
				Author:          author,
				Identifier:      scopus,
				IdentifierValue: row["scopus author id"],
			}
			if err := storage.Author().AddAuthorIdentifier(authorIdentifier); err != nil {
				return err
			}
		}
		if row["researcher id"] != "0" && row["researcher id"] != "" {
			authorIdentifier := &model.AuthorIdentifier{
				Author:          author,
				Identifier:      researcher,
				IdentifierValue: row["researcher id"],
			}
			if err := storage.Author().AddAuthorIdentifier(authorIdentifier); err != nil {
				return err
			}
		}
	}
	return nil
}
