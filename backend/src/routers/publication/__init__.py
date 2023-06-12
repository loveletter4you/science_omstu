from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.model.database import get_db
from src.routers.publication.controller import controller_get_publications, controller_get_publication_by_id, \
    controller_get_publication_types
from src.routers.publication.schema import Publication_params
from src.schemas.routers import SchemePublicationsRouter, SchemePublicationRouter


router = APIRouter(
    prefix="/api/publication",
    tags=["publication"],
    responses={404: {"description": "Not found"}}
)


@router.get("/publication_types")
async def get_publication_types(db: Session = Depends(get_db)):
    publication_types = await controller_get_publication_types(db)
    return publication_types


@router.get("", response_model=SchemePublicationsRouter)
async def get_publications(params: Publication_params = Depends(), db: Session = Depends(get_db)):
    publications = await controller_get_publications(params, db)
    return publications


@router.get("/{id}", response_model=SchemePublicationRouter)
async def get_publication_by_id(id: int, db: Session = Depends(get_db)):
    publication = await controller_get_publication_by_id(id, db)
    return publication
