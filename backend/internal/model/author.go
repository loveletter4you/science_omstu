package model

import "database/sql"

type Author struct {
	Id         int           `json:"id"`
	Name       string        `json:"name"`
	Surname    string        `json:"surname"`
	Patronymic string        `json:"patronymic"`
	UserID     sql.NullInt32 `json:"-"`
}

type AuthorIdentifier struct {
	Id              int         `json:"id"`
	Author          *Author     `json:"author,omitempty"`
	Identifier      *Identifier `json:"identifier_info,omitempty"`
	IdentifierValue string      `json:"identifier"`
}
