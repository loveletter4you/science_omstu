from sqlalchemy import func, desc, select
from sqlalchemy.ext.asyncio import AsyncSession as Session
from sqlalchemy.orm import joinedload

from src.model.model import Publication, AuthorPublication, Source, SourceRating, PublicationType, \
    Author, AuthorDepartment, KeywordPublication, PublicationLink, AuthorPublicationOrganization
from src.model.storage import get_count
from src.routers.publication.schema import Publication_params
from src.schemas.schemas import SchemePublication, SchemePublicationPage


async def service_get_publications(params: Publication_params, db: Session):
    query = select(Publication).filter(Publication.accepted == True)
    query = query.filter(Publication.publication_date >= params.from_date) \
        .filter(Publication.publication_date <= params.to_date)

    if not (params.search is None) and params.search != "":
        query = query.filter(func.lower(Publication.title).contains(params.search.lower()))
    if not (params.source_rating_type_id is None):
        query = query.join(Source).join(SourceRating) \
            .filter(SourceRating.source_rating_type_id == params.source_rating_type_id)
    if not (params.publication_type_id is None):
        query = query.filter(Publication.type_id == params.publication_type_id)
    if not (params.author_id is None):
        query = query.join(AuthorPublication).filter(AuthorPublication.author_id == params.author_id).distinct()
    if not (params.department_id is None):
        query = query.join(AuthorPublication).join(Author).join(AuthorDepartment) \
            .filter(AuthorDepartment.department_id == params.department_id).distinct()
    offset = params.limit * params.page
    publications_result = await db.execute(query.order_by(desc(Publication.publication_date))
                                           .order_by(Publication.title)
                                           .options(joinedload(Publication.publication_type))
                                           .options(joinedload(Publication.source))
                                           .options(joinedload(Publication.publication_authors)
                                                    .joinedload(AuthorPublication.author))
                                           .offset(offset).limit(params.limit))
    publications = publications_result.scalars().unique().all()
    scheme_publications = [SchemePublication.from_orm(publication) for publication in publications]
    count = await get_count(query, db)
    return dict(publications=scheme_publications, count=count)


async def service_get_publication(id: int, db: Session):
    publication_result = await db.execute(select(Publication).filter(Publication.id == id)
                                          .options(joinedload(Publication.publication_type))
                                          .options(joinedload(Publication.source))
                                          .options(joinedload(Publication.publication_authors)
                                                   .joinedload(AuthorPublication.author))
                                          .options(joinedload(Publication.publication_authors)
                                                   .joinedload(AuthorPublication.author_publication_organizations)
                                                   .joinedload(AuthorPublicationOrganization.organization)
                                                   )
                                          .options(joinedload(Publication.keyword_publications)
                                                   .joinedload(KeywordPublication.keyword))
                                          .options(joinedload(Publication.publication_links)
                                                   .joinedload(PublicationLink.publication_link_type)))
    publication = publication_result.scalars().first()
    if publication is None:
        return False
    scheme_publication = SchemePublicationPage.from_orm(publication)
    return dict(publication=scheme_publication)


async def service_get_publication_publication_types(db: Session):
    publcation_types = await db.execute(select(PublicationType))
    return dict(publication_types=publcation_types.scalars().all())
