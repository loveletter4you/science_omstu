package model

import "time"

type Publication struct {
	Id              int              `json:"id"`
	Type            *PublicationType `json:"type"`
	Source          *Source          `json:"source"`
	Title           string           `json:"title"`
	Abstract        string           `json:"abstract"`
	PublicationDate time.Time        `json:"publication_date"`
}

type PublicationType struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type KeywordPublication struct {
	Id          int64        `json:"id"`
	Publication *Publication `json:"publication"`
	Keyword     *Keyword     `json:"keyword"`
}

type PublicationLink struct {
	Id          int64                `json:"id"`
	Publication *Publication         `json:"publication"`
	LinkType    *PublicationLinkType `json:"linkType"`
	Link        string               `json:"link"`
}

type PublicationLinkType struct {
	Id   int
	Name string
}

type AuthorPublication struct {
	Id          int
	Author      *Author
	Publication *Publication
}
