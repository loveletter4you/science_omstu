from sqlalchemy import func, desc
from sqlalchemy.orm import Session

from src.model.model import Publication
from src.schemas.schemas import SchemePublication, SchemePublicationPage


async def service_get_publications(offset: int, limit: int, accepted: bool, db: Session):
    query = db.query(Publication).filter(Publication.accepted == accepted).order_by(desc(Publication.publication_date))
    publications = query.offset(offset).limit(limit).all()
    scheme_publications = [SchemePublication.from_orm(publication) for publication in publications]
    count = query.count()
    return dict(publications=scheme_publications, count=count)


async def service_get_publications_search(search: str, offset: int, limit: int, accepted: bool, db: Session):
    query = db.query(Publication).filter(Publication.accepted == accepted).filter(func.lower(Publication.title)
                                                                                  .contains(search.lower()))\
        .order_by(desc(Publication.publication_date))
    publications = query.offset(offset).limit(limit).all()
    scheme_publications = [SchemePublication.from_orm(publication) for publication in publications]
    count = query.count()
    return dict(publications=scheme_publications, count=count)


async def service_get_publication(id: int, db: Session):
    publication = db.query(Publication).filter(Publication.id == id).first()
    if publication is None:
        return False
    scheme_publication = SchemePublicationPage.from_orm(publication)
    return dict(publication=scheme_publication)
