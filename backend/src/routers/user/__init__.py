from fastapi import APIRouter, Depends, security
from sqlalchemy.orm import Session

from src.model.database import get_db
from src.routers.user.controller import controller_generate_token, controller_create_admin, controller_get_current_user, \
    controller_get_feedbacks
from src.schemas.routers import SchemeFeedbacksGetRouter
from src.schemas.schemas import SchemeUser

router = APIRouter(
    prefix="/api/user",
    tags=["user"],
    responses={404: {"description": "Not found"}}
)


@router.get("/create_admin")
async def create_admin(db: Session = Depends(get_db)):
    message = await controller_create_admin(db)
    return message


@router.post("/token")
async def login(form_data: security.OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login user
    :param form_data: login data
    :param db: Current db Session
    :return: JWT-token
    """
    token = await controller_generate_token(form_data, db)
    return token


@router.get("/admin/feedbacks", response_model=SchemeFeedbacksGetRouter)
async def get_feedbacks(page: int = 0, limit: int = 20, solved: bool = False,
                        user: SchemeUser = Depends(controller_get_current_user), db: Session = Depends(get_db)):
    feedbacks = await controller_get_feedbacks(page, limit, solved, user, db)
    return feedbacks
