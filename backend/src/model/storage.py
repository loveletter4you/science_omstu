from datetime import date

from sqlalchemy import Select, select, or_
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import func
from sqlalchemy.ext.asyncio import AsyncSession as Session


from src.model.model import PublicationLinkType, SourceType, SourceLinkType, Identifier, SourceRatingType, Organization, \
    Source, SourceLink, PublicationType, Publication, PublicationLink, Subject, PriorityDirections, \
    CriticalTechnologies, BudgetType, TypesN, Author, Nioktr


async def get_count(q: Select, db: Session):
    count_q = select(func.count()).select_from(q.subquery())
    count = await db.execute(count_q)
    return count.scalar()


async def get_or_create_publication_link_type(name: str, db: Session):
    pub_link_type_result = await db.execute(select(PublicationLinkType).filter(PublicationLinkType.name == name))
    pub_link_type = pub_link_type_result.scalars().first()
    if pub_link_type is None:
        pub_link_type = PublicationLinkType(name=name)
        db.add(pub_link_type)
        await db.commit()
    return pub_link_type


async def get_or_create_source_type(name: str, db: Session):
    source_type_result = await db.execute(select(SourceType).filter(SourceType.name == name))
    source_type = source_type_result.scalars().first()
    if source_type is None:
        source_type = SourceType(name=name)
        db.add(source_type)
        await db.commit()
    return source_type


async def get_or_create_source_link_type(name: str, db: Session):
    source_link_type_result = await db.execute(select(SourceLinkType).filter(SourceLinkType.name == name))
    source_link_type = source_link_type_result.scalars().first()
    if source_link_type is None:
        source_link_type = SourceLinkType(name=name)
        db.add(source_link_type)
        await db.commit()
    return source_link_type


async def get_or_create_identifier(name: str, db: Session):
    identifier_result = await db.execute(select(Identifier).filter(Identifier.name == name))
    identifier = identifier_result.scalars().first()
    if identifier is None:
        identifier = Identifier(name=name)
        db.add(identifier)
        await db.commit()
    return identifier


async def get_or_create_source_rating_type(name: str, db: Session):
    source_rating_type_result = await db.execute(select(SourceRatingType).filter(SourceRatingType.name == name))
    source_rating_type = source_rating_type_result.scalars().first()
    if source_rating_type is None:
        source_rating_type = SourceRatingType(name=name)
        db.add(source_rating_type)
        await db.commit()
    return source_rating_type


async def get_or_create_organization_omstu(db: Session):
    organization_omstu_result = await db.execute(select(Organization). \
        filter(Organization.name == "Омский государственный технический университет"))
    organization_omstu = organization_omstu_result.scalars().first()
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
        source_result = await db.execute(select(Source).join(SourceLink).filter(SourceLink.link == identifier))
        source = source_result.scalars().first()
        if not (source is None):
            return source
    source_result = await db.execute(select(Source).filter(func.lower(Source.name) == name.lower()))
    source = source_result.scalars().first()
    return source


async def get_or_create_publication_type(name: str, db: Session):
    publication_type_result = await db.execute(select(PublicationType).filter(PublicationType.name == name))
    publication_type = publication_type_result.scalars().first()
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


async def create_publication_link(publication: Publication,
                            publication_link_type: PublicationLinkType, link: str, db: Session):
    publication_link = PublicationLink(
            publication=publication,
            publication_link_type=publication_link_type,
            link=link
        )
    db.add(publication_link)
    await db.commit()
    return publication_link


async def create_source(name: str, source_type: SourceType, db: Session):
    source = Source(name=name, source_type=source_type)
    db.add(source)
    await db.commit()
    return source


async def create_source_link(source: Source, source_link_type: SourceLinkType, link: str, db: Session):
    source_link = SourceLink(
        source=source,
        source_link_type=source_link_type,
        link=link
    )
    db.add(source_link)
    await db.commit()
    return source_link


async def get_publication_by_doi_or_name(doi: str, name: str, db: Session):
    publication_result = await db.execute(select(Publication)
                                          .join(Publication.publication_links)
                                          .options(joinedload(Publication.publication_links))
                                          .filter(or_(Publication.title.ilike(name),
                                                      PublicationLink.link == doi)).distinct(Publication.id))
    publication = publication_result.scalars().first()
    return publication


async def get_subject_by_code(subj_code: str, db: Session):
    subject_result = await db.execute(select(Subject).filter(Subject.subj_code == subj_code))
    subject = subject_result.scalars().first()
    return subject


async def get_author_by_identifier(identifier_type: Identifier, value: str, db: Session):
    pass


# async def get_or_create_priority_directions(name: str, db: Session):
#     prioritu_directions_result = await db.execute(select(PriorityDirections).filter(PriorityDirections.name == name))
#     prioritu_directions = prioritu_directions_result.scalars().first()
#     if prioritu_directions is None:
#         prioritu_directions = PriorityDirections(name=name)
#         db.add(prioritu_directions)
#         await db.commit()
#     return prioritu_directions
#
#
# async def get_or_create_critical_tech(name: str, db: Session):
#     critical_tech_result = await db.execute(select(CriticalTechnologies).filter(CriticalTechnologies.name == name))
#     critical_tech = critical_tech_result.scalars().first()
#     if critical_tech is None:
#         critical_tech = PriorityDirections(name=name)
#         db.add(critical_tech)
#         await db.commit()
#     return critical_tech


async def get_or_create_budget_type(name: str, db: Session):
    budget_type_result = await db.execute(select(BudgetType).filter(BudgetType.name == name))
    budget_type = budget_type_result.scalars().first()
    if budget_type is None:
        budget_type = BudgetType(name=name)
        db.add(budget_type)
        await db.commit()
    return budget_type


async def get_or_create_types_n(name: str, db: Session):
    types_n_result = await db.execute(select(TypesN).filter(TypesN.name == name))
    types_n = types_n_result.scalars().first()
    if types_n is None:
        types_n = TypesN(name=name)
        db.add(types_n)
        await db.commit()
    return types_n


async def create_nioktr(author: Author, organization: Organization,
                       rosrid_id: str, name: str, annotation: str, created_date: date,
                        document_date: date, work_start_date: date, work_end_date: date,
                        contact_number: str,
                        db: Session):
    nioktr = Nioktr(
        author=author,
        organization=organization,
        rosrid_id=rosrid_id,
        name=name,
        annotation=annotation,
        created_date=created_date,
        document_date=document_date,
        work_start_date=work_start_date,
        work_end_date=work_end_date,
        contact_number=contact_number

    )
    db.add(nioktr)
    await db.commit()
    return nioktr


async def get_nioktr_by_name(name: str, db: Session):
    nioktr_result = await db.execute(select(Nioktr).filter(Nioktr.title.ilike(name)))
    nioktr = nioktr_result.scalars().first()
    return nioktr