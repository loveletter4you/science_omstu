import shutil

from fastapi import APIRouter, Depends, UploadFile
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
                      page: int = 0, limit: int = 20,
                      db: Session = Depends(get_db)):
    authors = await controller_get_authors(search, page, limit, db)
    return authors


@router.get("/{id}")
async def get_author_by_id(id: int):
    author = await controller_get_author(id)
    return author


@router.get("/{id}/publications")
async def get_author_publications(id: int):
    publications = await controller_get_author_publications(id)
    return publications


@router.post('/upload_authors')
async def authors_fill(file: UploadFile, db: Session = Depends(get_db)):
    filename = file.filename
    with open(f'/uploads/{filename}', "wb") as wf:
        shutil.copyfileobj(file.file, wf)
        file.file.close()
    message = await controller_fill_authors(f'/uploads/{filename}', db)
    return message
