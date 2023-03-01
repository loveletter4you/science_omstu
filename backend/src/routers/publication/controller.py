from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.routers.publication.service import service_get_publications, \
    service_get_publications_search, service_get_publication


async def controller_get_publications(search: str, page: int, limit: int, accepted: bool, db: Session):
    offset = page * limit
    if search is None:
        publications = await service_get_publications(offset, limit, accepted, db)
        return publications
    else:
        publications = await service_get_publications_search(search, offset, limit, accepted, db)
        return publications


async def controller_get_publication_by_id(id: int, db: Session):
    publication = await service_get_publication(id, db)
    if not publication:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return publication
