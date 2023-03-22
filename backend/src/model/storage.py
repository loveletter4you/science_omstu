from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from src.model.model import PublicationLinkType, SourceType, SourceLinkType, Identifier, SourceRatingType, Organization, \
    Source, SourceLink, PublicationType, Publication, PublicationLink


def get_or_create_publication_link_type(name: str, db: Session):
    pub_link_type = db.query(PublicationLinkType).filter(PublicationLinkType.name == name).first()
    if pub_link_type is None:
        pub_link_type = PublicationLinkType(name=name)
        db.add(pub_link_type)
        db.commit()
    return pub_link_type


def get_or_create_source_type(name: str, db: Session):
    source_type = db.query(SourceType).filter(SourceType.name == name).first()
    if source_type is None:
        source_type = SourceType(name=name)
        db.add(source_type)
        db.commit()
    return source_type


def get_or_create_source_link_type(name: str, db: Session):
    source_link_type = db.query(SourceLinkType).filter(SourceLinkType.name == name).first()
    if source_link_type is None:
        source_link_type = SourceLinkType(name=name)
        db.add(source_link_type)
        db.commit()
    return source_link_type


def get_or_create_identifier(name: str, db: Session):
    identifier = db.query(Identifier).filter(Identifier.name == name).first()
    if identifier is None:
        identifier = Identifier(name=name)
        db.add(identifier)
        db.commit()
    return identifier


def get_or_create_source_rating_type(name: str, db: Session):
    source_rating_type = db.query(SourceRatingType).filter(SourceRatingType.name == name).first()
    if source_rating_type is None:
        source_rating_type = SourceRatingType(name=name)
        db.add(source_rating_type)
        db.commit()
    return source_rating_type


def get_or_create_organization_omstu(db: Session):
    organization_omstu = db.query(Organization). \
        filter(Organization.name == "Омский государственный технический университет").first()
    if organization_omstu is None:
        organization_omstu = Organization(
            name="Омский государственный технический университет",
            country="Россия",
            city="Омск"
        )
        db.add(organization_omstu)
        db.commit()
    return organization_omstu


def get_source_by_name_or_identifiers(name: str, identifiers: list[str], db: Session):
    for identifier in identifiers:
        source = db.query(Source).join(SourceLink).filter(SourceLink.link == identifier).first()
        if not (source is None):
            return source
    source = db.query(Source).filter(func.lower(Source.name) == name.lower()).first()
    return source


def get_or_create_publication_type(name: str, db: Session):
    publication_type = db.query(PublicationType).filter(PublicationType.name == name).first()
    if publication_type is None:
        publication_type = PublicationType(name=name)
        db.add(publication_type)
        db.commit()
    return publication_type


def create_publication(publication_type: PublicationType, source: Source,
                       title: str, abstract: str | None, publication_date: date,
                       accepted: bool, db: Session):
    publication = Publication(
        publication_type=publication_type,
        source=source,
        title=title,
        abstract=abstract,
        publication_date=publication_date,
        accepted=accepted
    )
    db.add(publication)
    db.commit()
    return publication


def create_publication_link(publication: Publication,
                            publication_link_type: PublicationLinkType, link: str, db: Session):
    publication_link = PublicationLink(
            publication=publication,
            publication_link_type=publication_link_type,
            link=link
        )
    db.add(publication_link)
    return publication_link