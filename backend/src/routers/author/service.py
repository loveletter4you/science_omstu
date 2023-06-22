from sqlalchemy import or_, and_, func, desc, select
from sqlalchemy.ext.asyncio import AsyncSession as Session
from sqlalchemy.orm import selectinload, joinedload

from src.model.model import Author, AuthorPublication, Publication, AuthorIdentifier, AuthorPublicationOrganization, \
    Identifier, AuthorDepartment, Department, Faculty
from src.model.storage import get_or_create_organization_omstu, get_count
from src.schemas.schemas import SchemePublication, SchemeAuthor, SchemeAuthorProfile


async def service_get_authors(offset: int, limit: int, confirmed: bool, db: Session):
    query = select(Author).filter(Author.confirmed == confirmed).order_by(Author.surname)
    authors_count = await get_count(query, db)
    authors = await db.execute(query.offset(offset).limit(limit))
    scheme_authors = [SchemeAuthor.from_orm(author) for author in authors.scalars().all()]
    return dict(authors=scheme_authors, count=authors_count)


async def service_get_authors_search(search: str, offset: int, limit: int, confirmed: bool, db: Session):
    name = search.lower().split(' ')
    if len(name) == 1:
        authors_query = select(Author).filter(Author.confirmed == confirmed). \
            filter(or_(func.lower(Author.name).contains(name[0]),
                       func.lower(Author.surname).contains(name[0]))).order_by(Author.surname)
        authors_count = await get_count(authors_query, db)
        authors = await db.execute(authors_query.offset(offset).limit(limit))
        scheme_authors = [SchemeAuthor.from_orm(author) for author in authors.scalars().all()]
        return dict(authors=scheme_authors, count=len(authors_count.scalars().all()))
    else:
        authors_query = select(Author).filter(or_(Author.confirmed, Author.confirmed == confirmed)).filter(
            or_(and_(func.lower(Author.name).contains(name[0]), func.lower(Author.surname).contains(name[1])),
                and_(func.lower(Author.name).contains(name[1]), func.lower(Author.surname).contains(name[0]))))
        authors_count = await get_count(authors_query, db)
        authors = await db.execute(authors_query.offset(offset).limit(limit))
        scheme_authors = [SchemeAuthor.from_orm(author) for author in authors.scalars().all()]
        return dict(authors=scheme_authors, count=len(authors_count.scalars().all()))


async def service_get_author(id: int, db: Session):
    author_result = await db.execute(select(Author).filter(Author.id == id)
                                     .options(joinedload(Author.author_departments),
                                              joinedload(Author.author_identifiers)))
    author = author_result.scalars().first()
    if author is None:
        return False
    scheme_author = SchemeAuthorProfile.from_orm(author)
    return dict(author=scheme_author)


async def service_get_author_publications(id: int, offset: int, limit: int, db: Session):
    query = select(Publication).join(AuthorPublication, Publication.id == AuthorPublication.publication_id) \
        .order_by(desc(Publication.publication_date)) \
        .order_by(Publication.title).filter(AuthorPublication.author_id == id)
    publications = await db.execute(query.offset(offset).limit(limit))
    scheme_publications = [SchemePublication.from_orm(publication) for publication in publications.scalars().all()]
    count = await db.execute(query)
    return dict(publications=scheme_publications, count=count)


async def service_get_unconfirmed_omstu_authors(search: str, offset: int, limit: int, db: Session):
    organization_omstu = get_or_create_organization_omstu(db)
    if not search:
        query = select(Author).filter(Author.confirmed == False).join(AuthorPublication) \
            .join(AuthorPublicationOrganization) \
            .filter(AuthorPublicationOrganization.organization == organization_omstu).group_by(Author.id)
    else:
        name = search.lower().split(' ')
        if len(name) == 1:
            authors_query = select(Author).filter(Author.confirmed == False). \
                filter(or_(func.lower(Author.name).contains(name[0]),
                           func.lower(Author.surname).contains(name[0])))
        else:
            authors_query = select(Author).filter(Author.confirmed == False).filter(
                or_(and_(func.lower(Author.name).contains(name[0]), func.lower(Author.surname).contains(name[1])),
                    and_(func.lower(Author.name).contains(name[1]), func.lower(Author.surname).contains(name[0]))))
        query = authors_query.join(AuthorPublication).join(AuthorPublicationOrganization) \
            .filter(AuthorPublicationOrganization.organization == organization_omstu).group_by(Author.id)
    authors_count = await get_count(query, db)
    authors = await db.execute(query.offset(offset).limit(limit))
    scheme_authors = [SchemeAuthor.from_orm(author) for author in authors.scalars().all()]
    return dict(authors=scheme_authors, count=authors_count)


async def service_merge_authors(id_base: int, id_merge: int, db: Session):
    base_author_result = await db.execute(select(Author).filter(and_(Author.confirmed == True, Author.id == id_base)))
    base_author = base_author_result.scalars().first()
    if base_author is None:
        return None
    merged_author_result = await db.execute(
        select(Author).filter(and_(Author.confirmed == False, Author.id == id_merge)))
    merged_author = merged_author_result.scalars().first()
    if merged_author is None:
        return None
    merge_author_publcations_result = await db.execute(select(AuthorPublication)
                                                       .filter(AuthorPublication.author == merged_author))
    merge_author_publcations = merge_author_publcations_result.scalars().all()
    merge_author_identifiers_result = await db.execute(select(AuthorIdentifier)
                                                       .filter(AuthorIdentifier.author == merged_author))
    merge_author_identifiers = await merge_author_identifiers_result.scalars().all()
    for identifier in merge_author_identifiers:
        identifier.author = base_author
        await db.commit()

    for publication in merge_author_publcations:
        publication.author = base_author
        await db.commit()

    await db.refresh(merged_author)
    await db.delete(merged_author)
    await db.commit()

    return dict(author_id=id_base)
