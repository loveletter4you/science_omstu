from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.model.database import get_db
from src.routers.author.controller import controller_get_authors, controller_get_author, \
    controller_get_author_publications, controller_merge_authors, controller_get_unconfirmed_omstu_authors
from src.routers.user import controller_get_current_user
from src.schemas.routers import SchemePublicationsRouter, SchemeAuthorsRouter, SchemeAuthorRouter
from src.schemas.schemas import SchemeUser

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


@router.get("/unconfirmed_omstu", response_model=SchemeAuthorsRouter)
async def get_unconfirmed_omstu_authors(search: str = None,
                                        page: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    authors = await controller_get_unconfirmed_omstu_authors(search, page, limit, db)
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


@router.post("/{merged_id}/merge")
async def merge_authors(merged_id: int, base_id: int, user: SchemeUser = Depends(controller_get_current_user),
                        db: Session = Depends(get_db)):
    author = await controller_merge_authors(user, base_id, merged_id, db)
    return author

