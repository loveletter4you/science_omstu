package model

type Author struct {
	Id         int    `json:"author_id"`
	Name       string `json:"name"`
	Surname    string `json:"surname"`
	Patronymic string `json:"patronymic"`
	UserID     int    `json:"userID"`
}

type AuthorIdentifier struct {
	Id           int    `json:"id"`
	AuthorId     int    `json:"authorId"`
	IdentifierId int    `json:"identifierId"`
	Identifier   string `json:"identifier"`
}
