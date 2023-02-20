import shutil

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from src.model.database import get_db
from src.routers.author.controller import controller_get_authors, controller_get_author, \
    controller_get_author_publications, controller_fill_authors


router = APIRouter(
    prefix="/api/author",
    tags=["author"],
    responses={404: {"description": "Not found"}}
)


@router.get("")
async def get_authors(search: str = None,
                      page: int = 0, limit: int = 20, confirmed: bool = True,
                      db: Session = Depends(get_db)):
    authors = await controller_get_authors(search, page, limit, confirmed, db)
    return authors


@router.get("/{id}")
async def get_author_by_id(id: int, db: Session = Depends(get_db)):
    author = await controller_get_author(id, db)
    return author


@router.get("/{id}/publications")
async def get_author_publications(id: int,
                                  page: int = 0, limit: int = 20,
                                  db: Session = Depends(get_db)):
    publications = await controller_get_author_publications(id, page, limit, db)
    return publications


@router.post('/upload_authors')
async def authors_fill(file: UploadFile = File(...), db: Session = Depends(get_db)):
    message = await controller_fill_authors(file, db)
    print(message)
    return message
