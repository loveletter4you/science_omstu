from sqlalchemy import func, desc, or_
from sqlalchemy.orm import Session

from src.model.model import Source, Publication, SourceLink
from src.schemas.schemas import SchemeSourceWithType, SchemeSourceWithRating, SchemePublication


async def service_get_sources(offset: int, limit: int, db: Session):
    query = db.query(Source)
    sources = query.offset(offset).limit(limit).all()
    count = query.count()
    scheme_sources = [SchemeSourceWithType.from_orm(source) for source in sources]
    return dict(sources=scheme_sources, count=count)


async def service_get_sources_search(search: str, offset: int, limit: int, db: Session):
    query = db.query(Source).join(SourceLink)\
        .filter(or_(func.replace(SourceLink.link, '-', '').contains(search.replace('-', '')),
                                                         func.lower(Source.name).contains(search.lower())))\
        .group_by(Source.id)
    sources = query.offset(offset).limit(limit).all()
    count = query.count()
    scheme_sources = [SchemeSourceWithType.from_orm(source) for source in sources]
    return dict(sources=scheme_sources, count=count)


async def service_get_source(id: int, db: Session):
    source = db.query(Source).filter(Source.id == id).first()
    if source is None:
        return False
    scheme_source = SchemeSourceWithRating.from_orm(source)
    return dict(source=scheme_source)


async def service_get_source_publications(id: int, offset: int, limit: int, db: Session):
    query = db.query(Publication).join(Source).order_by(desc(Publication.publication_date))\
        .order_by(Publication.title).filter(Source.id == id)
    publications = query.offset(offset).limit(limit).all()
    scheme_publications = [SchemePublication.from_orm(publication) for publication in publications]
    count = query.count()
    return dict(publications=scheme_publications, count=count)
