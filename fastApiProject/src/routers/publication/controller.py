from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from src.routers.publication.service import service_fill_scopus, service_get_publications, \
    service_get_publications_search, service_get_publication


async def controller_get_publications(search: str, page: int, limit: int, accepted: bool, db: Session):
    offset = page * limit
    if search is None:
        publications = await service_get_publications(offset, limit, accepted, db)
        return publications
    else:
        publications = await service_get_publications_search(search, offset, limit, accepted, db)
        return publications


async def controller_get_publication_types():
    return {'asd': 'asd'}


async def controller_get_publication_by_id(id: int, db: Session):
    publication = await service_get_publication(id, db)
    return publication


async def controller_get_publication_authors_by_id(id: int):
    return {"asd": id}


async def controller_fill_scopus(file: UploadFile, db: Session):
    message = await service_fill_scopus(file, db)
    return message
