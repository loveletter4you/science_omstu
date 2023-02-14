from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from src.routers.publication.service import service_fill_scopus


async def controller_get_publications(page: int, limit: int):
    return {"asd:": limit}


async def controller_get_publication_types():
    return {'asd': 'asd'}


async def controller_get_publication_by_id(id: int):
    return {"asd": id}


async def controller_get_publication_authors_by_id(id: int):
    return {"asd": id}


async def controller_fill_scopus(file: UploadFile, db: Session):
    message = await service_fill_scopus(file, db)
    return message
