import pandas as pd
from sqlalchemy import func, desc, and_
from sqlalchemy.orm import Session
from sqlalchemy.testing import in_

from src.model.model import Publication, PublicationType, SourceRatingType, SourceRating, Source, Organization, \
    AuthorPublication, AuthorPublicationOrganization, Author, AuthorIdentifier, AuthorDepartment, Identifier
from datetime import date

from src.schemas.schemas import SchemeOrganization, SchemeAuthorIdentifier, SchemePublicationAnalysis


async def get_service_analysis(from_date: date, to_date: date, db: Session):
    result = []
    query = db.query(Publication).filter(Publication.publication_date >= from_date)\
        .filter(Publication.publication_date <= to_date)
    for year in range(from_date.year, to_date.year + 1):
        count = query.filter(func.extract('year', Publication.publication_date) == year).count()
        if count != 0:
            result.append(dict(year=year, count=count))
    total = query.count()
    return dict(result=result, total=total)


async def get_source_rating(from_date: date, to_date: date, db: Session):
    result = []

    source_rating_types = db.query(SourceRatingType).all()
    query = db.query(Publication).join(Source).join(SourceRating).join(SourceRatingType)\
        .filter(Publication.publication_date >= from_date) \
        .filter(Publication.publication_date <= to_date)
    for rating_type in source_rating_types:
        rating_query = query.filter(SourceRatingType.id == rating_type.id).group_by(Publication.id).distinct()
        pubs_id = [x.id for x in rating_query]
        id = rating_type.id
        name = rating_type.name
        counts = []
        for year in range(from_date.year, to_date.year + 1):
            count = db.query(Publication).filter(and_(func.extract('year', Publication.publication_date) == year,
                                                      Publication.id.in_(pubs_id))).count()
            if count != 0:
                counts.append(dict(year=year, count=count))
        total = rating_query.count()

        result.append(dict(source_rating=dict(id=id, name=name), counts=counts, total=total))

    return dict(result=result)


async def get_organization(search: str, max_count: int, from_date: date, to_date: date, db: Session):
    """Отсортировать организации по кол-ву"""
    result = []
    if search is not None:
        organization = db.query(Organization).filter(func.lower(Organization.name).contains(search.lower()))\
            .join(AuthorPublicationOrganization).join(AuthorPublication) \
            .join(Publication).order_by(desc(func.count(Organization.id))).group_by(Organization.id)\
            .limit(max_count).all()
    else:
        organization = db.query(Organization).join(AuthorPublicationOrganization).join(AuthorPublication) \
            .join(Publication).order_by(desc(func.count(Organization.id))).group_by(Organization.id)\
            .limit(max_count).all()

    query = db.query(Publication).join(AuthorPublication).join(AuthorPublicationOrganization).join(Organization) \
        .filter(Publication.publication_date >= from_date) \
        .filter(Publication.publication_date <= to_date)

    for org in organization:
        org_query = query.filter(Organization.id == org.id).group_by(Publication.id)
        pubs_id = [x.id for x in org_query]
        counts = []
        for year in range(from_date.year, to_date.year + 1):
            count = db.query(Publication).filter(and_(func.extract('year', Publication.publication_date) == year,
                                                      Publication.id.in_(pubs_id))).count()
            if count != 0:
                counts.append(dict(year=year, count=count))
        total = org_query.count()
        scheme_organization = SchemeOrganization.from_orm(org)
        result.append(dict(organization=scheme_organization, counts=counts, total=total))

    return dict(result=result)


async def get_organization_collaborations(id: int, search: str, max_count: int, from_date: date, to_date: date, db: Session):
    """Отсортировать организации по кол-ву"""
    result = []
    if search is not None:
        organization = db.query(Organization).filter(func.lower(Organization.name).contains(search.lower())).limit(max_count).all()
    else:
        organization = db.query(Organization).limit(max_count).all()

    publications = db.query(Publication).join(AuthorPublication).join(AuthorPublicationOrganization).join(Organization) \
        .filter(Publication.publication_date >= from_date) \
        .filter(Publication.publication_date <= to_date).filter(Organization.id == id).group_by(Publication.id)

    pub_id = [obj.id for obj in publications]

    organizations = db.query(Organization).join(AuthorPublicationOrganization).join(AuthorPublication).join(Publication).filter(Publication.id.in_(pub_id))\
        .order_by(desc(func.count(Organization.id))).group_by(Organization.id).limit(max_count).all()

    query = db.query(Publication).join(AuthorPublication).join(AuthorPublicationOrganization).join(Organization).filter(Publication.id.in_(pub_id))

    for org in organizations:
        org_query = query.\
            filter(Organization.id == org.id).group_by(Publication.id)
        counts = []
        for year in range(from_date.year, to_date.year + 1):
            count = org_query.filter(func.extract('year', Publication.publication_date) == year).count()
            if count != 0:
                counts.append(dict(year=year, count=count))
        total = org_query.count()
        scheme_organization = SchemeOrganization.from_orm(org)
        result.append(dict(organization=scheme_organization, counts=counts, total=total))

    return dict(result=result)


async def service_author_analysis(id: int, db: Session):
    author = db.query(Author).filter(Author.id == id).first()
    author_identifiers = db.query(AuthorIdentifier).filter(AuthorIdentifier.author_id == id).all()
    author_identifiers_schemas = [SchemeAuthorIdentifier.from_orm(author_identifier) for author_identifier in author_identifiers]
    query = db.query(Publication).join(AuthorPublication).order_by(desc(Publication.publication_date)) \
        .order_by(Publication.title).filter(AuthorPublication.author_id == id)
    publications = query.all()
    publications_schemas = [SchemePublicationAnalysis.from_orm(publication) for publication in publications]
    source_rating_types = db.query(SourceRatingType).all()
    result = []
    for rating_type in source_rating_types:
            rating_query = query.join(Source).join(SourceRating).join(SourceRatingType).filter(SourceRatingType.id == rating_type.id).group_by(Publication.id).distinct()
            pubs_id = [x.id for x in rating_query]
            id = rating_type.id
            name = rating_type.name
            counts = []
            for year in range(2018, 2022 + 1):
                count = db.query(Publication).filter(and_(func.extract('year', Publication.publication_date) == year,
                                                          Publication.id.in_(pubs_id))).count()
                if count != 0:
                    counts.append(dict(year=year, count=count))
            result.append(dict(source_rating=dict(id=id, name=name), counts=counts))
    return dict(author=author, author_identifier=author_identifiers_schemas, publications=publications_schemas, result=result)


async def service_docent_analysis(from_date: date, to_date: date, db: Session):
    authors = db.query(Author).join(AuthorDepartment).filter(AuthorDepartment.position == 'доцент').all()
    orcid = db.query(Identifier).filter(Identifier.name == 'ORCID').first()
    elibrary_id = db.query(Identifier).filter(Identifier.name == 'Elibrary ID').first()
    vak_type = db.query(SourceRatingType).filter(SourceRatingType.name == 'ВАК').first()
    white_list = db.query(SourceRatingType).filter(SourceRatingType.name == '«Белый список» РЦНИ').first()
    author_surname, author_name, author_patronymic, author_elibrary_list, author_orcid_list, all_count, vak_count, \
        white_list_coint = [], [], [], [], [], [], [], []
    df = pd.DataFrame()
    for author in authors:
        author_elibrary = db.query(AuthorIdentifier).filter(and_(AuthorIdentifier.author_id == author.id, AuthorIdentifier.identifier_id == elibrary_id.id)).first()
        author_orcid = db.query(AuthorIdentifier).filter(and_(AuthorIdentifier.author_id == author.id, AuthorIdentifier.identifier_id == orcid.id)).first()
        if not author_elibrary or not author_orcid:
            continue
        query = db.query(Publication).join(AuthorPublication).order_by(desc(Publication.publication_date)) \
            .order_by(Publication.title).filter(AuthorPublication.author_id == author.id)\
            .filter(Publication.publication_date >= from_date) \
            .filter(Publication.publication_date <= to_date)
        vak_query = query.join(Source).join(SourceRating).join(SourceRatingType).filter(
            SourceRatingType.id == vak_type.id).group_by(Publication.id).distinct()
        white_list_query = query.join(Source).join(SourceRating).join(SourceRatingType).filter(
            SourceRatingType.id == white_list.id).group_by(Publication.id).distinct()
        author_surname.append(author.surname)
        author_name.append(author.name)
        author_patronymic.append(author.patronymic)
        author_elibrary_list.append(author_elibrary.identifier_value)
        author_orcid_list.append(author_orcid.identifier_value)
        all_count.append(query.count())
        vak_count.append(vak_query.count())
        white_list_coint.append(white_list_query.count())
    df['Фамилия'] = author_surname
    df['Имя'] = author_name
    df['Отчество'] = author_patronymic
    df['Elibrary ID'] = author_elibrary_list
    df['ORCID'] = author_orcid_list
    df['Количество публикаций'] = all_count
    df['Количество публикаций в ВАК'] = vak_count
    df['Количество публикаций в белом списке'] = white_list_coint
    df.to_csv('Доценты 18-22.csv')
