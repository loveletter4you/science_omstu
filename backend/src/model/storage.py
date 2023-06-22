from datetime import date

from sqlalchemy import Select, select
from sqlalchemy.sql import func
from sqlalchemy.ext.asyncio import AsyncSession as Session


from src.model.model import PublicationLinkType, SourceType, SourceLinkType, Identifier, SourceRatingType, Organization, \
    Source, SourceLink, PublicationType, Publication, PublicationLink


async def get_count(q: Select, db: Session):
    count_q = select(func.count()).select_from(q.subquery())
    count = await db.execute(count_q)
    return count.scalar()


async def get_or_create_publication_link_type(name: str, db: Session):
    pub_link_type = await db.query(PublicationLinkType).filter(PublicationLinkType.name == name).first()
    if pub_link_type is None:
        pub_link_type = PublicationLinkType(name=name)
        db.add(pub_link_type)
        await db.commit()
    return pub_link_type


async def get_or_create_source_type(name: str, db: Session):
    source_type = await db.query(SourceType).filter(SourceType.name == name).first()
    if source_type is None:
        source_type = SourceType(name=name)
        db.add(source_type)
        await db.commit()
    return source_type


async def get_or_create_source_link_type(name: str, db: Session):
    source_link_type = await db.query(SourceLinkType).filter(SourceLinkType.name == name).first()
    if source_link_type is None:
        source_link_type = SourceLinkType(name=name)
        db.add(source_link_type)
        await db.commit()
    return source_link_type


async def get_or_create_identifier(name: str, db: Session):
    identifier = await db.query(Identifier).filter(Identifier.name == name).first()
    if identifier is None:
        identifier = Identifier(name=name)
        db.add(identifier)
        await db.commit()
    return identifier


async def get_or_create_source_rating_type(name: str, db: Session):
    source_rating_type = await db.query(SourceRatingType).filter(SourceRatingType.name == name).first()
    if source_rating_type is None:
        source_rating_type = SourceRatingType(name=name)
        db.add(source_rating_type)
        await db.commit()
    return source_rating_type


async def get_or_create_organization_omstu(db: Session):
    organization_omstu = await db.query(Organization). \
        filter(Organization.name == "Омский государственный технический университет").first()
    if organization_omstu is None:
        organization_omstu = Organization(
            name="Омский государственный технический университет",
            country="Россия",
            city="Омск"
        )
        db.add(organization_omstu)
        await db.commit()
    return organization_omstu


async def get_source_by_name_or_identifiers(name: str, identifiers: list[str], db: Session):
    for identifier in identifiers:
        source = await db.query(Source).join(SourceLink).filter(SourceLink.link == identifier).first()
        if not (source is None):
            return source
    source = await db.query(Source).filter(func.lower(Source.name) == name.lower()).first()
    return source


async def get_or_create_publication_type(name: str, db: Session):
    publication_type = await db.query(PublicationType).filter(PublicationType.name == name).first()
    if publication_type is None:
        publication_type = PublicationType(name=name)
        db.add(publication_type)
        await db.commit()
    return publication_type


async def create_publication(publication_type: PublicationType, source: Source,
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
    await db.commit()
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
