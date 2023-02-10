import pandas as pd
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session

from src.model.model import Author, Identifier


async def service_get_authors(offset: int, limit: int, db: Session):
    authors_count = db.query(Author).count()
    authors = db.query(Author).offset(offset).limit(limit).all()
    return dict(authors=authors, authors_count=authors_count)


async def service_get_authors_search(search: str, offset: int, limit: int, db: Session):
    name = search.split(' ')
    if len(name) == 1:
        authors_query = db.query(Author).filter(or_(Author.name.contains(name[0]), Author.surname.contains(name[0])))
        authors_count = authors_query.count()
        authors = authors_query.offset(offset).limit(limit).all()
        return dict(authors=authors, authors_count=authors_count)
    else:
        authors_query = db.query(Author).filter(
            or_(and_(Author.name.contains(name[0]), Author.surname.contains(name[1])),
                and_(Author.name.contains(name[1]), Author.surname.contains(name[0]))))
        authors_count = authors_query.count()
        authors = authors_query.offset(offset).limit(limit).all()
        return dict(authors=authors, authors_count=authors_count)


async def service_get_author(id: int, db: Session):
    author = db.query(Author).filter(Author.id == id).first()


async def service_fill_authors(filepath: str, db: Session):
    author_df = pd.read_csv(filepath)
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
            patronymic=row['patronymic']
        )
