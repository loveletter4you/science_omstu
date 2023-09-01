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
    confirmed: bool

    class Config:
        orm_mode = True


class SchemeAuthorIdentifier(BaseModel):
    id: int
    identifier: SchemeIdentifier
    identifier_value: str

    class Config:
        orm_mode = True


class SchemeFaculty(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class SchemeDepartment(BaseModel):
    id: int
    name: str
    faculty: SchemeFaculty

    class Config:
        orm_mode = True


class SchemeAuthorDepartment(BaseModel):
    department: SchemeDepartment
    position: str

    class Config:
        orm_mode = True


class SchemeAuthorProfile(SchemeAuthor):
    author_identifiers: List[SchemeAuthorIdentifier]
    author_departments: List[SchemeAuthorDepartment]


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


class SchemeSourceWithLink(SchemeSource):
    source_links: List[SchemeSourceLink]


class SchemePublication(BaseModel):
    id: int
    publication_type: SchemePublicationType
    source: SchemeSourceWithLink
    title: str
    publication_date: date
    publication_authors: List[SchemeAuthorPublication]
    publication_links: List[SchemePublicationLink]

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


class SchemeSubject(BaseModel):
    subj_code: str
    name: str

    class Config:
        orm_mode = True


class SchemeSourceRatingSubject(BaseModel):
    subject: SchemeSubject
    rating_date: date
    to_rating_date: date
    active: bool

    class Config:
        orm_mode = True


class SchemeSourceRatingDate(BaseModel):
    active: bool
    rating_date: date
    to_rating_date: date


    class Config:
        orm_mode = True


class SchemeSourceRating(BaseModel):
    source_rating_type: SchemeSourceRatingType
    source_rating_subjects: List[SchemeSourceRatingSubject]
    source_rating_dates: List[SchemeSourceRatingDate]
    rating: str | None

    class Config:
        orm_mode = True


class SchemeSourceWithRating(SchemeSourceWithType):
    source_ratings: List[SchemeSourceRating]
    source_links: List[SchemeSourceLink]


class SchemeFeedback(BaseModel):
    name: str
    mail: str
    message: str

    class Config:
        orm_mode = True


class SchemeFeedbackOutput(SchemeFeedback):
    date: date
    solved: bool


class SchemeUser(BaseModel):
    id: int
    role_id: int

    class Config:
        orm_mode = True


class SchemeAnalysis(BaseModel):
    year: int
    count: int


class SchemeAnalysisSourceRating(BaseModel):
    id: int
    name: str


class SchemeAnalysisRating(BaseModel):
    source_rating: SchemeAnalysisSourceRating
    counts: List[SchemeAnalysis]
    total: int


class SchemeAnalysisOrganization(BaseModel):
    organization: SchemeOrganization
    counts: List[SchemeAnalysis]
    total: int


class SchemeSourceAnalysis(SchemeSource):
    source_ratings: List[SchemeSourceRating]


class SchemePublicationAnalysis(BaseModel):
    id: int
    source: SchemeSourceAnalysis
    title: str
    publication_date: date

    class Config:
        orm_mode = True
