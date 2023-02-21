import pandas as pd
from fastapi import UploadFile
from sqlalchemy import or_, and_, func
from sqlalchemy.orm import Session, joinedload

from src.model.model import Author, Identifier, AuthorIdentifier, AuthorPublication, Publication
from src.schemas.schemas import SchemePublication, SchemeAuthor, SchemeAuthorProfile


async def service_get_authors(offset: int, limit: int, confirmed: bool, db: Session):
    query = db.query(Author).filter(Author.confirmed == confirmed)
    authors_count = query.count()
    authors = query.offset(offset).limit(limit).all()
    scheme_authors = [SchemeAuthor.from_orm(author) for author in authors]
    return dict(authors=scheme_authors, count=authors_count)


async def service_get_authors_search(search: str, offset: int, limit: int, confirmed: bool, db: Session):
    name = search.lower().split(' ')
    if len(name) == 1:
        authors_query = db.query(Author).filter(Author.confirmed == confirmed). \
            filter(or_(func.lower(Author.name).contains(name[0]),
                       func.lower(Author.surname).contains(name[0])))
        authors_count = authors_query.count()
        authors = authors_query.offset(offset).limit(limit).all()
        scheme_authors = [SchemeAuthor.from_orm(author) for author in authors]
        return dict(authors=scheme_authors, count=authors_count)
    else:
        authors_query = db.query(Author).filter(or_(Author.confirmed, Author.confirmed == confirmed)).filter(
            or_(and_(func.lower(Author.name).contains(name[0]), func.lower(Author.surname).contains(name[1])),
                and_(func.lower(Author.name).contains(name[1]), func.lower(Author.surname).contains(name[0]))))
        authors_count = authors_query.count()
        authors = authors_query.offset(offset).limit(limit).all()
        scheme_authors = [SchemeAuthor.from_orm(author) for author in authors]
        return dict(authors=scheme_authors, count=authors_count)


async def service_get_author(id: int, db: Session):
    author = db.query(Author).filter(Author.id == id).first()
    scheme_author = SchemeAuthorProfile.from_orm(author)
    return dict(author=scheme_author)


async def service_get_author_publications(id: int, offset: int, limit: int, db: Session):
    query = db.query(Publication).join(AuthorPublication).filter(AuthorPublication.author_id == id)
    publications = query.offset(offset).limit(limit).all()
    scheme_publications = [SchemePublication.from_orm(publication) for publication in publications]
    count = query.count()
    return dict(publications=scheme_publications, count=count)


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
