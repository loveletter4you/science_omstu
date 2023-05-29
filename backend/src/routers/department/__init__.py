from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.model.database import get_db
from src.routers.department.controller import controller_get_departments, controller_get_faculties, \
    controller_get_faculty

router = APIRouter(
    prefix="/api/faculty",
    tags=["faculty"],
    responses={404: {"description": "Not found"}}
)


@router.get("")
async def get_faculties(page: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    faculties = await controller_get_faculties(page, limit, db)
    return faculties


@router.get("/{id}")
async def get_faculty(id: int, db: Session = Depends(get_db)):
    faculty = await controller_get_faculty(id, db)
    return faculty


@router.get("/departments")
async def get_departments(page: int = 0, limit: int = 20,
                      db: Session = Depends(get_db)):
    departments = await controller_get_departments(page, limit, db)
    return departments
