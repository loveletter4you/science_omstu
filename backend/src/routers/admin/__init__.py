from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from src.model.database import get_db
from src.routers.admin.controller import controller_create_admin, controller_get_feedbacks, controller_fill_authors, \
    controller_fill_scopus
from src.routers.user import controller_get_current_user
from src.schemas.routers import SchemeFeedbacksGetRouter
from src.schemas.schemas import SchemeUser


router = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
    responses={404: {"description": "Not found"}}
)


@router.get("/create_admin")
async def create_admin(db: Session = Depends(get_db)):
    message = await controller_create_admin(db)
    return message


@router.get("/feedbacks", response_model=SchemeFeedbacksGetRouter)
async def get_feedbacks(page: int = 0, limit: int = 20, solved: bool = False,
                        user: SchemeUser = Depends(controller_get_current_user), db: Session = Depends(get_db)):
    feedbacks = await controller_get_feedbacks(page, limit, solved, user, db)
    return feedbacks


@router.post('/upload/authors')
async def authors_fill(file: UploadFile = File(...),
                       user: SchemeUser = Depends(controller_get_current_user), db: Session = Depends(get_db)):
    message = await controller_fill_authors(file, user, db)
    return message


@router.post("/upload/scopus")
async def scopus_fill(file: UploadFile = File(...),
                      user: SchemeUser = Depends(controller_get_current_user), db: Session = Depends(get_db)):
    message = await controller_fill_scopus(file, user, db)
    return message
