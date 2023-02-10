from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.routers.author.service import service_get_authors, service_get_authors_search


async def controller_get_authors(search: str, page: int, limit: int, db: Session):
    offset = page * limit
    if search is None:
        authors = await service_get_authors(offset, limit, db)
        return authors
    else:
        authors = await service_get_authors_search(search, offset, limit, db)
        return authors


async def controller_get_author(id: int, db: Session):
    return {"asd": id}


async def controller_get_author_publications(id: int, db: Session):
    return {"asd": id}


async def controller_fill_authors(filepath: str, db: Session):
    return {}
