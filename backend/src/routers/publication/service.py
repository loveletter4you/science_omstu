from sqlalchemy import func, desc, select
from sqlalchemy.ext.asyncio import AsyncSession as Session

from src.model.model import Publication, AuthorPublication, Source, SourceRating, PublicationType, \
    Author, AuthorDepartment
from src.routers.publication.schema import Publication_params
from src.schemas.schemas import SchemePublication, SchemePublicationPage


async def service_get_publications(params: Publication_params, db: Session):
    query = select(Publication).filter(Publication.accepted == True)
    query = query.filter(Publication.publication_date >= params.from_date) \
        .filter(Publication.publication_date <= params.to_date)
    if not (params.search is None) and params.search != "":
        query = query.filter(func.lower(Publication.title).contains(params.search.lower()))
    if not (params.source_rating_type_id is None):
        query = query.join(Source).join(SourceRating)\
            .filter(SourceRating.source_rating_type_id == params.source_rating_type_id)
    if not (params.publication_type_id is None):
        query = query.filter(Publication.type_id == params.publication_type_id)
    if not (params.author_id is None):
        query = query.join(AuthorPublication).filter(AuthorPublication.author_id == params.author_id).distinct()
    if not (params.department_id is None):
        query = query.join(AuthorPublication).join(Author).join(AuthorDepartment)\
            .filter(AuthorDepartment.department_id == params.department_id).distinct()
    offset = params.limit * params.page
    publications = await db.execute(query.order_by(desc(Publication.publication_date))
                                    .order_by(Publication.title).offset(offset).limit(params.limit).all())
    scheme_publications = [SchemePublication.from_orm(publication) for publication in publications.scalars().all()]
    count = await db.execute(query)
    return dict(publications=scheme_publications, count=len(count.scalars().all()))


async def service_get_publication(id: int, db: Session):
    publication_result = await db.execute(select(Publication).filter(Publication.id == id))
    publication = publication_result.scalars().one()
    if publication is None:
        return False
    scheme_publication = SchemePublicationPage.from_orm(publication)
    return dict(publication=scheme_publication)


async def service_get_publication_publication_types(db: Session):
    publcation_types = db.query(PublicationType).all()
    return dict(publication_types=publcation_types)
