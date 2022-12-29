package model

type Organization struct {
	Id      int    `json:"id"`
	Name    string `json:"name"`
	Country string `json:"country"`
	City    string `json:"city"`
}

type AuthorPublicationOrganization struct {
	Id                int                `json:"id"`
	AuthorPublication *AuthorPublication `json:"author_publication"`
	Organization      *Organization      `json:"organization"`
}
