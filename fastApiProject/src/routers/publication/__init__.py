from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from src.model.database import get_db
from src.routers.publication.controller import controller_get_publications, controller_get_publication_types, \
    controller_get_publication_by_id, controller_get_publication_authors_by_id, controller_fill_scopus

router = APIRouter(
    prefix="/api/publication",
    tags=["publication"],
    responses={404: {"description": "Not found"}}
)


@router.get("")
async def get_publications(page: int = 0, limit: int = 20):
    publications = await controller_get_publications(page, limit)
    return publications


@router.get("/types")
async def get_publication_types():
    publication_types = await controller_get_publication_types()
    return publication_types


@router.get("/{id}")
async def get_publication_by_id(id: int):
    publication = await controller_get_publication_by_id(id)
    return publication


@router.get("/{id}/authors")
async def get_publication_authors_by_id(id: int):
    authors = await controller_get_publication_authors_by_id(id)
    return authors


@router.post("/scopus/fill")
async def scopus_fill(file: UploadFile = File(...), db: Session = Depends(get_db)):
    message = await controller_fill_scopus(file, db)
    return message
