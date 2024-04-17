from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession as Session
from src.model.database import get_db
from src.routers.dissertation.schema import Dissertation_params
from src.routers.dissertation.service import service_update_dissertation, service_get_dissertations, \
    service_get_dissertation_by_id
from src.schemas.routers import SchemeDissertationsRouter, SchemeDissertationRouter

router = APIRouter(
    prefix="/api/dissertation",
    tags=["dissertation"],
    responses={404: {"description": "Not found"}}
)


@router.post("/upload/dissertation")
async def dissertation_update(db: Session = Depends(get_db)):
    message = await service_update_dissertation(db)
    return message


@router.get("", response_model=SchemeDissertationsRouter)
async def get_dissertations(params: Dissertation_params = Depends(), db: Session = Depends(get_db)):
    dissertations = await service_get_dissertations(params, db)
    return dissertations


@router.get("/{id}", response_model=SchemeDissertationRouter)
async def get_dissertation_by_id(id: int, db: Session = Depends(get_db)):
    dissertation = await service_get_dissertation_by_id(id, db)
    return dissertation