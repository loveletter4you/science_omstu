import pandas as pd
import numpy as np
from fastapi import UploadFile
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session, joinedload

import datetime

from src.model.model import PublicationLinkType, SourceType, SourceLinkType, Identifier, Source, SourceLink, \
    PublicationType, Publication, PublicationLink, AuthorIdentifier, AuthorPublication, Author, \
    AuthorPublicationOrganization


async def service_get_publications(offset: int, limit: int, accepted: bool, db: Session):
    publications = db.query(Publication)\
        .filter(Publication.accepted == accepted)\
        .options(joinedload(Publication.publication_type))\
        .options(joinedload(Publication.publication_authors).joinedload(AuthorPublication.author))\
        .offset(offset).limit(limit).all()
    count = db.query(Publication).filter(Publication.accepted == accepted).count()
    return dict(publications=publications, count=count)


async def service_get_publications_search(search: str, offset: int, limit: int, accepted: bool, db: Session):
    return


async def service_get_publication(id: int, db: Session):
    publication = db.query(Publication) \
        .filter(Publication.id == id) \
        .options(joinedload(Publication.publication_type)) \
        .options(joinedload(Publication.publication_authors).joinedload(AuthorPublication.author))\
        .options(joinedload(Publication.publication_authors)
                 .joinedload(AuthorPublication.author_publication_organizations)
                 .joinedload(AuthorPublicationOrganization.organization))\
        .options(joinedload(Publication.source).joinedload(Source.source_type)).first()
    return dict(publication=publication)


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

    for _, row in scopus_df.iterrows():
        source = db.query(Source).filter(Source.name == row['Source title']).first()
        if source is None:
            source = Source(name=row['Source title'])
            if row['Document Type'] == "Conference Paper":
                source.source_type = source_type_conference
            else:
                source.source_type = source_type_journal
            db.add(source)
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
            identifier = db.query(AuthorIdentifier).\
                filter(and_(AuthorIdentifier.identifier_id == identifier_scopus.id,
                       AuthorIdentifier.identifier_value == authors_scopus[i])).first()
            author: Author
            if identifier is None:
                author_full_name = author_row.split(',')
                author = Author(
                    name=author_full_name[1].replace(' ', ''),
                    surname=author_full_name[0].replace(' ', ''),
                    confirmed=False
                )
                author_identifier = AuthorIdentifier(
                    author=author,
                    identifier=identifier_scopus,
                    identifier_value=authors_scopus[i]
                )
                db.add(author)
                db.add(author_identifier)
            else:
                author = identifier.author
            author_publication = AuthorPublication(
                publication=publication,
                author=author
            )
            db.add(author_publication)
    db.commit()
    return {'Message': 'OK'}
