package filldb

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/model"
	"github.com/loveletter4u/cris/internal/storage"
	"io"
)

func AuthorsFill(reader io.Reader, storage *storage.Storage) {
	dataSet := CSVToMap(reader)

	if err := storage.Open(); err != nil {
		fmt.Println(err)
		return
	}

	spin := &model.Identifier{Name: "spin"}
	if err := storage.Identifier().AddIdentifier(spin); err != nil {
		fmt.Println(err)
		return
	}

	orcid := &model.Identifier{Name: "orcid"}
	if err := storage.Identifier().AddIdentifier(orcid); err != nil {
		fmt.Println(err)
		return
	}

	scopus := &model.Identifier{Name: "scopus"}
	if err := storage.Identifier().AddIdentifier(scopus); err != nil {
		fmt.Println(err)
		return
	}

	researcher := &model.Identifier{Name: "researcher"}
	if err := storage.Identifier().AddIdentifier(researcher); err != nil {
		fmt.Println(err)
		return
	}

	for _, row := range dataSet {
		author := &model.Author{
			Name:       row["name"],
			Surname:    row["surname"],
			Patronymic: row["patronymic"],
		}
		if err := storage.Author().AddAuthor(author); err != nil {
			fmt.Println(err)
			return
		}
		if row["spin"] != "0" && row["spin"] != "" {
			authorIdentifier := &model.AuthorIdentifier{
				Author:          author,
				Identifier:      spin,
				IdentifierValue: row["spin"],
			}
			if err := storage.Author().AddAuthorIdentifier(authorIdentifier); err != nil {
				fmt.Println(err)
				return
			}
		}
		if row["orcid"] != "0" && row["orcid"] != "" {
			authorIdentifier := &model.AuthorIdentifier{
				Author:          author,
				Identifier:      orcid,
				IdentifierValue: row["orcid"],
			}
			if err := storage.Author().AddAuthorIdentifier(authorIdentifier); err != nil {
				return
			}
		}
		if row["scopus author id"] != "0" && row["scopus author id"] != "" {
			authorIdentifier := &model.AuthorIdentifier{
				Author:          author,
				Identifier:      scopus,
				IdentifierValue: row["scopus author id"],
			}
			if err := storage.Author().AddAuthorIdentifier(authorIdentifier); err != nil {
				return
			}
		}
		if row["researcher id"] != "0" && row["researcher id"] != "" {
			authorIdentifier := &model.AuthorIdentifier{
				Author:          author,
				Identifier:      researcher,
				IdentifierValue: row["researcher id"],
			}
			if err := storage.Author().AddAuthorIdentifier(authorIdentifier); err != nil {
				return
			}
		}
	}
	storage.Close()
}
