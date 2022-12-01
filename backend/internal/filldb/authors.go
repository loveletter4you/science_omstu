package filldb

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/storage"
	"io"
)

func AuthorsFill(reader io.Reader, storage *storage.Storage) {
	dataSet := CSVToMap(reader)

	if err := storage.Open(); err != nil {
		fmt.Println(err)
		return
	}
	query := "INSERT INTO identifiers(name) VALUES ('spin'), ('orcid'), ('scopus'), ('researcher_id')"
	storage.Db.QueryRow(query).Scan()
	var spin, orcid, scopus, researcher int
	query = "SELECT id FROM identifiers WHERE name = 'spin'"
	err := storage.Db.QueryRow(query).Scan(&spin)
	if err != nil {
		fmt.Println(err)
		return
	}
	query = "SELECT id FROM identifiers WHERE name = 'orcid'"
	err = storage.Db.QueryRow(query).Scan(&orcid)
	if err != nil {
		fmt.Println(err)
		return
	}
	query = "SELECT id FROM identifiers WHERE name = 'scopus'"
	err = storage.Db.QueryRow(query).Scan(&scopus)
	if err != nil {
		fmt.Println("DB query err")
		return
	}
	query = "SELECT id FROM identifiers WHERE name = 'researcher_id'"
	err = storage.Db.QueryRow(query).Scan(&researcher)
	if err != nil {
		fmt.Println(err)
		return
	}
	for _, row := range dataSet {
		query := fmt.Sprintf("INSERT INTO authors (name, surname, patronymic) VALUES ('%s', '%s', '%s') RETURNING id",
			row["name"], row["surname"], row["patronymic"])
		var authorId int
		err := storage.Db.QueryRow(query).Scan(&authorId)
		if err != nil {
			fmt.Println(err)
			return
		}
		if row["spin"] != "0" && row["spin"] != "" {
			query = fmt.Sprintf("INSERT INTO author_identifier (author_id, identifier_id, identifier) VALUES (%d, %d, '%s')",
				authorId, spin, row["spin"])
			storage.Db.QueryRow(query).Scan()
		}
		if row["orcid"] != "0" && row["orcid"] != "" {
			query = fmt.Sprintf("INSERT INTO author_identifier (author_id, identifier_id, identifier) VALUES (%d, %d, '%s')",
				authorId, orcid, row["orcid"])
			storage.Db.QueryRow(query).Scan()
		}
		if row["scopus"] != "0" && row["scopus"] != "" {
			query = fmt.Sprintf("INSERT INTO author_identifier (author_id, identifier_id, identifier) VALUES (%d, %d, '%s')",
				authorId, scopus, row["scopus"])
			storage.Db.QueryRow(query).Scan()
		}
		if row["researcher id"] != "0" && row["researcher id"] != "" {
			query = fmt.Sprintf("INSERT INTO author_identifier (author_id, identifier_id, identifier) VALUES (%d, %d, '%s')",
				authorId, scopus, row["researcher id"])
			storage.Db.QueryRow(query).Scan()
		}
	}
	storage.Close()
}
