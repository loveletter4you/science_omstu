package model

import "time"

type Source struct {
	Id         int         `json:"id"`
	SourceType *SourceType `json:"source_type"`
	Name       string      `json:"name"`
}

type SourceType struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type SourceLinkType struct {
	Id   int
	Name string
}

type SourceLink struct {
	Id             int64
	Source         *Source
	SourceLinkType *SourceLinkType
	Link           string
}

type SourceRatingType struct {
	id   int
	name string
}

type SourceRating struct {
	Id               int64
	Source           *Source
	SourceRatingType *SourceRatingType
	Rating           string
	RatingDate       time.Time
}
