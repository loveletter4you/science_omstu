from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session

from src.routers.author.service import service_get_authors, service_get_authors_search, \
    service_get_author, service_get_author_publications


async def controller_get_authors(search: str, page: int, limit: int, confirmed: bool, db: Session):
    offset = page * limit
    if search is None:
        authors = await service_get_authors(offset, limit, confirmed, db)
        return authors
    else:
        authors = await service_get_authors_search(search, offset, limit, confirmed, db)
        return authors


async def controller_get_author(id: int, db: Session):
    author = await service_get_author(id, db)
    if not author:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return author


async def controller_get_author_publications(id: int, page: int, limit: int, db: Session):
    offset = page * limit
    publications = await service_get_author_publications(id, offset, limit, db)
    return publications
