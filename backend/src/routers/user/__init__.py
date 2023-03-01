from fastapi import APIRouter, Depends, security
from sqlalchemy.orm import Session

from src.model.database import get_db
from src.routers.user.controller import controller_generate_token, controller_get_current_user


router = APIRouter(
    prefix="/api/user",
    tags=["user"],
    responses={404: {"description": "Not found"}}
)


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

