from datetime import date

from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session

from src.routers.admin.pandas_service import service_fill_authors, service_fill_scopus, service_white_list_fill, \
    service_jcr_list_fill
from src.routers.admin.service import service_create_admin, service_admin_check, service_get_feedbacks
from src.schemas.schemas import SchemeUser


async def controller_get_feedbacks(page: int, limit: int, solved: bool, user: SchemeUser, db: Session):
    is_admin = await service_admin_check(user.role_id, db)
    if not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Доступ запрещен")
    offset = page * limit
    feedbacks = await service_get_feedbacks(offset, limit, solved, db)
    return feedbacks


async def controller_create_admin(db: Session):
    message = await service_create_admin(db)
    return message


async def controller_fill_authors(file: UploadFile, user: SchemeUser, db: Session):
    is_admin = await service_admin_check(user.role_id, db)
    if not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Доступ запрещен")
    message = await service_fill_authors(file, db)
    return message


async def controller_fill_scopus(rating_date: date, file: UploadFile, user: SchemeUser, db: Session):
    is_admin = await service_admin_check(user.role_id, db)
    if not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Доступ запрещен")
    message = await service_fill_scopus(rating_date, file, db)
    return message


async def controller_fill_white_list(rating_date: date, file: UploadFile, user: SchemeUser, db: Session):
    is_admin = await service_admin_check(user.role_id, db)
    if not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Доступ запрещен")
    message = await service_white_list_fill(rating_date, file, db)
    return message


async def controller_jcr_list_fill(rating_date: date, file: UploadFile, user: SchemeUser, db: Session):
    is_admin = await service_admin_check(user.role_id, db)
    if not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Доступ запрещен")
    message = await service_jcr_list_fill(rating_date, file, db)
    return message


