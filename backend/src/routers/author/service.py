from sqlalchemy import or_, and_, func, desc
from sqlalchemy.orm import Session

from src.model.model import Author, AuthorPublication, Publication
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
    if author is None:
        return False
    scheme_author = SchemeAuthorProfile.from_orm(author)
    return dict(author=scheme_author)


async def service_get_author_publications(id: int, offset: int, limit: int, db: Session):
    query = db.query(Publication).join(AuthorPublication).filter(AuthorPublication.author_id == id)\
        .order_by(desc(Publication.publication_date))
    publications = query.offset(offset).limit(limit).all()
    scheme_publications = [SchemePublication.from_orm(publication) for publication in publications]
    count = query.count()
    return dict(publications=scheme_publications, count=count)
