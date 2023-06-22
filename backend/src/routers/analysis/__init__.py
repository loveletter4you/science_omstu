from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession as Session
from src.model.database import get_db
from src.routers.analysis.service import get_service_analysis, get_source_rating, get_organization, \
    get_organization_collaborations, service_author_analysis, service_docent_analysis

from datetime import date

from src.schemas.routers import SchemeAnalysisRouter, SchemeAnalysisRatingRouter, SchemeAnalysisOrganizationRouter

router = APIRouter(
    prefix="/api/analysis",
    tags=["analysis"],
    responses={404: {"description": "Not found"}}
)


@router.get('/', response_model=SchemeAnalysisRouter)
async def analysis(from_data: date = date(date.today().year - 5, 1, 1), to_date: date = date.today(),
                   db: Session = Depends(get_db)):
    result = await get_service_analysis(from_data, to_date, db)
    return result


@router.get('/source_rating', response_model=SchemeAnalysisRatingRouter)
async def analysis(from_data: date = date(date.today().year - 5, 1, 1), to_date: date = date.today(),
                   db: Session = Depends(get_db)):
    result = await get_source_rating(from_data, to_date, db)
    return result


@router.get('/organization', response_model=SchemeAnalysisOrganizationRouter)
async def analysis(search: str = None, max_count: int = 5, from_data: date = date(date.today().year - 5, 1, 1),
                   to_date: date = date.today(), db: Session = Depends(get_db)):
    result = await get_organization(search, max_count, from_data, to_date, db)
    return result


@router.get('/organization/{id}/collaborations', response_model=SchemeAnalysisOrganizationRouter)
async def get_source_publications(id: int, search: str = None, max_count: int = 5,
                                  from_data: date = date(date.today().year - 5, 1, 1), to_date: date = date.today(),
                                  db: Session = Depends(get_db)):
    publications = await get_organization_collaborations(id, search, max_count, from_data, to_date, db)
    return publications


@router.get('/author/docent')
async def get_author_analysis(position: str, from_date: date, to_date: date, db: Session = Depends(get_db)):
    author = await service_docent_analysis(position, from_date, to_date, db)
    return author


