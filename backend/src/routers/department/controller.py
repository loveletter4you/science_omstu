from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.routers.department.service import service_get_departments, service_get_faculties, service_get_faculty


async def controller_get_departments(page: int, limit: int, db: Session):
    offset = page * limit
    departments = await service_get_departments(offset, limit, db)
    return departments


async def controller_get_faculties(page: int, limit: int, db: Session):
    offset = page * limit
    faculties = await service_get_faculties(offset, limit, db)
    return faculties


async def controller_get_faculty(id: int, db: Session):
    faculty = await service_get_faculty(id, db)
    if not faculty:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return faculty
