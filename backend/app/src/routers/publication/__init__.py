from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from src.model.database import get_db
from src.routers.publication.controller import controller_get_publications, controller_get_publication_types, \
    controller_get_publication_by_id, controller_fill_scopus
from src.schemas.schemas import SchemePublication

router = APIRouter(
    prefix="/api/publication",
    tags=["publication"],
    responses={404: {"description": "Not found"}}
)


@router.get("")
async def get_publications(search: str = None,
                           page: int = 0, limit: int = 20, accepted: bool = True,
                           db: Session = Depends(get_db)):
    publications = await controller_get_publications(search, page, limit, accepted, db)
    return publications


@router.get("/{id}")
async def get_publication_by_id(id: int, db: Session = Depends(get_db)):
    publication = await controller_get_publication_by_id(id, db)
    return publication


@router.post("/scopus/fill")
async def scopus_fill(file: UploadFile = File(...), db: Session = Depends(get_db)):
    message = await controller_fill_scopus(file, db)
    return message
