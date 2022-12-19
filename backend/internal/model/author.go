package model

import "database/sql"

//Модели, как в базе данных

type Author struct {
	Id         int           `json:"id"`
	Name       string        `json:"name"`
	Surname    string        `json:"surname"`
	Patronymic string        `json:"patronymic"`
	UserID     sql.NullInt32 `json:"-"`
}

type AuthorIdentifier struct {
	Id              int64       `json:"id"`
	Author          *Author     `json:"author,omitempty"`
	Identifier      *Identifier `json:"identifier_info,omitempty"`
	IdentifierValue string      `json:"identifier"`
}

type Interest struct {
	Id   int
	Name string
}

type AuthorInterest struct {
	Id       int64
	Interest *Interest
	Author   *Author
}
