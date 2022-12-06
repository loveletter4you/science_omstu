package model

import "database/sql"

type Author struct {
	Id         int           `json:"author_id"`
	Name       string        `json:"name"`
	Surname    string        `json:"surname"`
	Patronymic string        `json:"patronymic"`
	UserID     sql.NullInt32 `json:"userID"`
}

type AuthorIdentifier struct {
	Id             int    `json:"author_identifier_id"`
	AuthorId       int    `json:"author_id"`
	IdentifierId   int    `json:"identifier_id"`
	Identifier     string `json:"identifier"`
	IdentifierName string `json:"identifier_name"`
}
