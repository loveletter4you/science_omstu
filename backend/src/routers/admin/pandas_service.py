import pandas as pd
import numpy as np
from fastapi import UploadFile
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

import datetime

from src.model.model import PublicationLinkType, SourceType, SourceLinkType, Identifier, Source, SourceLink, \
    PublicationType, Publication, PublicationLink, AuthorIdentifier, AuthorPublication, Author, \
    AuthorPublicationOrganization, Keyword, KeywordPublication, SourceRatingType, SourceRating, Organization


async def service_fill_scopus(file: UploadFile, db: Session):
    scopus_df = pd.read_csv(file.file, on_bad_lines='skip')
    scopus_df = scopus_df.replace(np.nan, "")
    pub_link_type_doi = db.query(PublicationLinkType).filter(PublicationLinkType.name == "DOI").first()
    if pub_link_type_doi is None:
        pub_link_type_doi = PublicationLinkType(name="DOI")
        db.add(pub_link_type_doi)

    pub_link_type_scopus = db.query(PublicationLinkType).filter(PublicationLinkType.name == "Scopus").first()
    if pub_link_type_scopus is None:
        pub_link_type_scopus = PublicationLinkType(name="Scopus")
        db.add(pub_link_type_scopus)

    source_type_journal = db.query(SourceType).filter(SourceType.name == "Журнал").first()
    if source_type_journal is None:
        source_type_journal = SourceType(name="Журнал")
        db.add(source_type_journal)

    source_type_conference = db.query(SourceType).filter(SourceType.name == "Конференция").first()
    if source_type_conference is None:
        source_type_conference = SourceType(name="Конференция")
        db.add(source_type_conference)

    source_link_type_issn = db.query(SourceLinkType).filter(SourceLinkType.name == "ISSN").first()
    if source_link_type_issn is None:
        source_link_type_issn = SourceLinkType(name="ISSN")
        db.add(source_link_type_issn)

    identifier_scopus = db.query(Identifier).filter(Identifier.name == "Scopus Author ID").first()
    if identifier_scopus is None:
        identifier_scopus = Identifier(name="Scopus Author ID")
        db.add(identifier_scopus)

    scopus_rating_type = db.query(SourceRatingType).filter(SourceRatingType.name == "Scopus").first()
    if scopus_rating_type is None:
        scopus_rating_type = SourceRatingType(name='Scopus')
        db.add(scopus_rating_type)

    organization_omstu = db.query(Organization).\
        filter(Organization.name == "Омский государственный технический университет").first()
    if organization_omstu is None:
        organization_omstu = Organization(
            name="Омский государственный технический университет",
            country="Россия",
            city="Омск"
        )
        db.add(organization_omstu)

    for _, row in scopus_df.iterrows():
        source = db.query(Source).filter(Source.name == row['Source title']).first()
        if source is None:
            source = Source(name=row['Source title'])
            if row['Document Type'] == "Conference Paper":
                source.source_type = source_type_conference
            else:
                source.source_type = source_type_journal
            db.add(source)
            source_rating_scopus = SourceRating(
                source_rating_type=scopus_rating_type,
                source=source,
                rating="Входит",
                rating_date=datetime.date(year=2023, month=1, day=1)
            )
            db.add(source_rating_scopus)
            if row['ISSN'] != "":
                source_link = SourceLink(
                    source=source,
                    source_link_type=source_link_type_issn,
                    link=row['ISSN']
                )
                db.add(source_link)
            db.commit()
        publication_type = db.query(PublicationType).filter(PublicationType.name == row["Document Type"]).first()
        if publication_type is None:
            publication_type = PublicationType(name=row['Document Type'])
            db.add(publication_type)
            db.commit()
        date = datetime.date(int(row['Year']), 1, 1)
        if row['DOI'] != "":
            link_doi = db.query(PublicationLink).filter(PublicationLink.link == row['DOI']).first()
            if link_doi is not None:
                continue
        link_scopus = db.query(PublicationLink).filter(PublicationLink.link == row['Link']).first()
        if link_scopus is not None:
            continue
        publication = db.query(Publication).filter(or_(Publication.title.ilike(row['Title']))).first()
        if publication is not None:
            continue
        publication = Publication(
            publication_type=publication_type,
            source=source,
            title=row['Title'],
            abstract=row['Abstract'],
            publication_date=date,
            accepted=True
        )
        db.add(publication)
        link_scopus = PublicationLink(
            publication=publication,
            publication_link_type=pub_link_type_scopus,
            link=row['Link']
        )
        db.add(link_scopus)
        if row['DOI'] != "":
            link_doi = PublicationLink(
                publication=publication,
                publication_link_type=pub_link_type_doi,
                link=row['DOI']
            )
            db.add(link_doi)
        authors_orgs = row['Authors with affiliations'].split(';')
        authors_scopus = row['Author(s) ID'].split(';')
        for i, author_row in enumerate(authors_orgs):
            if i >= len(authors_scopus):
                continue
            author_data = author_row.split(', ')
            identifier = db.query(AuthorIdentifier).\
                filter(and_(AuthorIdentifier.identifier_id == identifier_scopus.id,
                       AuthorIdentifier.identifier_value == authors_scopus[i])).first()
            author: Author
            if identifier is None:
                author: Author
                if len(author_data) > 1:
                    author = Author(
                        name=author_data[1],
                        surname=author_data[0],
                        confirmed=False
                    )
                else:
                    author = Author(
                        name='-',
                        surname=author_data[0],
                        confirmed=False
                    )
                db.add(author)
                author_identifier = AuthorIdentifier(
                    author=author,
                    identifier=identifier_scopus,
                    identifier_value=authors_scopus[i]
                )
                db.add(author_identifier)
            else:
                author = identifier.author
            author_publication = AuthorPublication(
                publication=publication,
                author=author
            )
            db.add(author_publication)
            if 'Omsk State Technical University' in author_data:
                author_publication_organization = AuthorPublicationOrganization(
                    author_publication=author_publication,
                    organization=organization_omstu
                )
                db.add(author_publication_organization)
            elif len(author_data) > 2:
                organization = db.query(Organization).filter(Organization.name == author_data[2]).first()
                if organization is None:
                    organization = Organization(name=author_data[2])
                    db.add(organization)
                author_publication_organization = AuthorPublicationOrganization(
                    author_publication=author_publication,
                    organization=organization
                )
                db.add(author_publication_organization)
            db.commit()
        if row['Author Keywords'] != "":
            keywords = set(row['Author Keywords'].split('; '))
            for keyword_value in keywords:
                keyword = db.query(Keyword).filter(Keyword.keyword == keyword_value).first()
                if keyword is None:
                    keyword = Keyword(
                        keyword=keyword_value
                    )
                    db.add(keyword)
                publication_keyword = KeywordPublication(
                    publication=publication,
                    keyword=keyword
                )
                db.add(publication_keyword)
        db.commit()
    db.commit()
    return {'Message': 'OK'}


async def service_fill_authors(file: UploadFile, db: Session):
    author_df = pd.read_csv(file.file)
    identifier_spin = db.query(Identifier).filter(Identifier.name == "SPIN-код").first()
    if identifier_spin is None:
        identifier_spin = Identifier(name="SPIN-код")
        db.add(identifier_spin)
    identifier_orcid = db.query(Identifier).filter(Identifier.name == "ORCID").first()
    if identifier_orcid is None:
        identifier_orcid = Identifier(name="ORCID")
        db.add(identifier_orcid)
    identifier_scopus = db.query(Identifier).filter(Identifier.name == "Scopus Author ID").first()
    if identifier_scopus is None:
        identifier_scopus = Identifier(name="Scopus Author ID")
        db.add(identifier_scopus)
    identifier_researcher = db.query(Identifier).filter(Identifier.name == "ResearcherID").first()
    if identifier_researcher is None:
        identifier_researcher = Identifier(name="ResearcherID")
        db.add(identifier_researcher)
    for _, row in author_df.iterrows():
        author = Author(
            name=row['name'],
            surname=row['surname'],
            patronymic=row['patronymic'],
            confirmed=True
        )
        db.add(author)
        if str(row['spin']) != "0":
            author_identifier_spin = AuthorIdentifier(
                author=author,
                identifier=identifier_spin,
                identifier_value=row['spin']
            )
            db.add(author_identifier_spin)
        if str(row['orcid']) != "0":
            author_identifier_orcid = AuthorIdentifier(
                author=author,
                identifier=identifier_orcid,
                identifier_value=row['orcid']
            )
            db.add(author_identifier_orcid)
        if str(row['scopus author id']) != "0":
            author_identifier_scopus = AuthorIdentifier(
                author=author,
                identifier=identifier_scopus,
                identifier_value=row['scopus author id']
            )
            db.add(author_identifier_scopus)
        if str(row['researcher id']) != "0":
            author_identifier_researcher = AuthorIdentifier(
                author=author,
                identifier=identifier_researcher,
                identifier_value=row['researcher id']
            )
            db.add(author_identifier_researcher)
    db.commit()
    return {"message": "OK"}