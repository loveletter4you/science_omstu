from sqlalchemy import or_, and_, func, desc
from sqlalchemy.orm import Session

from src.model.model import Author, AuthorPublication, Publication, AuthorIdentifier, AuthorPublicationOrganization
from src.model.storage import get_or_create_organization_omstu
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
    query = db.query(Publication).join(AuthorPublication).order_by(desc(Publication.publication_date))\
        .order_by(Publication.title).filter(AuthorPublication.author_id == id)
    publications = query.offset(offset).limit(limit).all()
    scheme_publications = [SchemePublication.from_orm(publication) for publication in publications]
    count = query.count()
    return dict(publications=scheme_publications, count=count)


async def service_get_unconfirmed_omstu_authors(search: str, offset: int, limit: int, db: Session):
    organization_omstu = get_or_create_organization_omstu(db)
    if not search:
        query = db.query(Author).filter(Author.confirmed == False).join(AuthorPublication)\
            .join(AuthorPublicationOrganization)\
            .filter(AuthorPublicationOrganization.organization == organization_omstu).group_by(Author.id)
    else:
        name = search.lower().split(' ')
        if len(name) == 1:
            authors_query = db.query(Author).filter(Author.confirmed == False). \
                filter(or_(func.lower(Author.name).contains(name[0]),
                           func.lower(Author.surname).contains(name[0])))
        else:
            authors_query = db.query(Author).filter(Author.confirmed == False).filter(
                or_(and_(func.lower(Author.name).contains(name[0]), func.lower(Author.surname).contains(name[1])),
                    and_(func.lower(Author.name).contains(name[1]), func.lower(Author.surname).contains(name[0]))))
        query = authors_query.join(AuthorPublication).join(AuthorPublicationOrganization) \
            .filter(AuthorPublicationOrganization.organization == organization_omstu).group_by(Author.id)
    authors_count = query.count()
    authors = query.offset(offset).limit(limit).all()
    scheme_authors = [SchemeAuthor.from_orm(author) for author in authors]
    return dict(authors=scheme_authors, count=authors_count)


async def service_merge_authors(id_base: int, id_merge: int, db: Session):
    base_author = db.query(Author).filter(and_(Author.confirmed == True, Author.id == id_base)).first()
    if base_author is None:
        return None
    merged_author = db.query(Author).filter(and_(Author.confirmed == False, Author.id == id_merge)).first()
    if merged_author is None:
        return None
    merge_author_publcations = db.query(AuthorPublication).filter(AuthorPublication.author == merged_author).all()
    merge_author_identifiers = db.query(AuthorIdentifier).filter(AuthorIdentifier.author == merged_author).all()
    for identifier in merge_author_identifiers:
        identifier.author = base_author
        db.commit()

    for publication in merge_author_publcations:
        publication.author = base_author
        db.commit()

    db.refresh(merged_author)
    db.delete(merged_author)
    db.commit()

    return dict(author_id=id_base)
