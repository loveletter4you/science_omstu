from datetime import date
from typing import List

from pydantic import BaseModel


class SchemeIdentifier(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class SchemeAuthor(BaseModel):
    id: int
    name: str
    surname: str
    patronymic: str | None

    class Config:
        orm_mode = True


class SchemeAuthorIdentifier(BaseModel):
    id: int
    identifier: SchemeIdentifier
    identifier_value: str

    class Config:
        orm_mode = True


class SchemeAuthorProfile(SchemeAuthor):
    author_identifiers: List[SchemeAuthorIdentifier]


class SchemeOrganization(BaseModel):
    id: int
    name: str
    country: str | None
    city: str | None

    class Config:
        orm_mode = True


class SchemeAuthorPublication(BaseModel):
    author: SchemeAuthor

    class Config:
        orm_mode = True


class SchemeAuthorPublicationOrganization(BaseModel):
    organization: SchemeOrganization

    class Config:
        orm_mode = True


class SchemeAuthorPublicationWithOrgs(SchemeAuthorPublication):
    author_publication_organizations: List[SchemeAuthorPublicationOrganization]

    class Config:
        orm_mode = True


class SchemePublicationType(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class SchemeSource(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class SchemePublication(BaseModel):
    id: int
    publication_type: SchemePublicationType
    source: SchemeSource
    title: str
    publication_date: date
    publication_authors: List[SchemeAuthorPublication]

    class Config:
        orm_mode = True


class SchemeKeyword(BaseModel):
    id: int
    keyword: str

    class Config:
        orm_mode = True


class SchemeKeywordPublication(BaseModel):
    keyword: SchemeKeyword

    class Config:
        orm_mode = True


class SchemePublicationLinkType(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class SchemePublicationLink(BaseModel):
    publication_link_type: SchemePublicationLinkType
    link: str

    class Config:
        orm_mode = True


class SchemePublicationPage(SchemePublication):
    abstract: str | None
    accepted: bool
    keyword_publications: List[SchemeKeywordPublication]
    publication_links: List[SchemePublicationLink]
    publication_authors: List[SchemeAuthorPublicationWithOrgs]

    class Config:
        orm_mode = True


class SchemeSourceType(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class SchemeSourceWithType(SchemeSource):
    source_type: SchemeSourceType


class SchemeSourceRatingType(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class SchemeSourceRating(BaseModel):
    source_rating_type: SchemeSourceRatingType
    rating: str
    rating_date: date

    class Config:
        orm_mode = True


class SchemeSourceLinkType(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class SchemeSourceLink(BaseModel):
    source_link_type: SchemeSourceLinkType
    link: str

    class Config:
        orm_mode = True


class SchemeSourceWithRating(SchemeSourceWithType):
    source_ratings: List[SchemeSourceRating]
    source_links: List[SchemeSourceLink]
