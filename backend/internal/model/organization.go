package model

type Organization struct {
	Id      int
	Name    string
	Country string
	City    string
}

type AuthorPublicationOrganization struct {
	Id                int
	AuthorPublication *AuthorPublication
	Organization      *Organization
}
