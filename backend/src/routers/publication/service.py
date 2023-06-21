from sqlalchemy import func, desc, and_
from sqlalchemy.orm import Session

from src.model.model import Publication, AuthorPublication, Source, SourceRating, SourceRatingType, PublicationType, \
    Author, AuthorDepartment
from src.routers.publication.schema import Publication_params
from src.schemas.schemas import SchemePublication, SchemePublicationPage


async def service_get_publications(params: Publication_params, db: Session):
    query = db.query(Publication).filter(Publication.accepted == True)
    query = query.filter(Publication.publication_date >= params.from_date) \
        .filter(Publication.publication_date <= params.to_date)
    if not (params.search is None) and params.search != "":
        query = query.filter(func.lower(Publication.title).contains(params.search.lower()))
    if not (params.source_rating_type_id is None):
        query = query.join(Source).join(SourceRating)\
            .filter(SourceRating.source_rating_type_id == params.source_rating_type_id).distinct()
        pubs_id = [x.id for x in query]
        query = db.query(Publication).filter(Publication.id.in_(pubs_id))
    if not (params.publication_type_id is None):
        query = query.filter(Publication.type_id == params.publication_type_id)
    if not (params.author_id is None):
        query = query.join(AuthorPublication).filter(AuthorPublication.author_id == params.author_id).distinct()
    if not (params.department_id is None):
        query = query.join(AuthorPublication).join(Author).join(AuthorDepartment)\
            .filter(AuthorDepartment.department_id == params.department_id).distinct()
    offset = params.limit * params.page
    publications = query.order_by(desc(Publication.publication_date)).order_by(Publication.title).offset(offset).limit(params.limit).all()
    scheme_publications = [SchemePublication.from_orm(publication) for publication in publications]
    count = query.count()
    return dict(publications=scheme_publications, count=count)


async def service_get_publication(id: int, db: Session):
    publication = db.query(Publication).filter(Publication.id == id).first()
    if publication is None:
        return False
    scheme_publication = SchemePublicationPage.from_orm(publication)
    return dict(publication=scheme_publication)


async def service_get_publication_publication_types(db: Session):
    publcation_types = db.query(PublicationType).all()
    return dict(publication_types=publcation_types)
