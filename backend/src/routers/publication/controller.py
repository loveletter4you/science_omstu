from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.routers.publication.schema import Publication_params
from src.routers.publication.service import service_get_publications, service_get_publication, \
    service_get_publication_publication_types


async def controller_get_publications(params: Publication_params, db: Session):
    publications = await service_get_publications(params, db)
    return publications


async def controller_get_publication_by_id(id: int, db: Session):
    publication = await service_get_publication(id, db)
    if not publication:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return publication


async def controller_get_publication_types(db: Session):
    publication_types = await service_get_publication_publication_types(db)
    return publication_types
