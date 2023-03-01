from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.model.database import get_db
from src.routers.author.controller import controller_get_authors, controller_get_author, \
    controller_get_author_publications
from src.schemas.routers import SchemePublicationsRouter, SchemeAuthorsRouter, SchemeAuthorRouter


router = APIRouter(
    prefix="/api/author",
    tags=["author"],
    responses={404: {"description": "Not found"}}
)


@router.get("", response_model=SchemeAuthorsRouter)
async def get_authors(search: str = None,
                      page: int = 0, limit: int = 20, confirmed: bool = True,
                      db: Session = Depends(get_db)):
    authors = await controller_get_authors(search, page, limit, confirmed, db)
    return authors


@router.get("/{id}", response_model=SchemeAuthorRouter)
async def get_author_by_id(id: int, db: Session = Depends(get_db)):
    author = await controller_get_author(id, db)
    return author


@router.get("/{id}/publications", response_model=SchemePublicationsRouter)
async def get_author_publications(id: int,
                                  page: int = 0, limit: int = 20,
                                  db: Session = Depends(get_db)):
    publications = await controller_get_author_publications(id, page, limit, db)
    return publications
