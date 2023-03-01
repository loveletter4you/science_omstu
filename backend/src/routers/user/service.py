from fastapi import security
from sqlalchemy.orm import Session
import jwt as _jwt

from settings_env import SECRET_KEY
from src.model.model import User
from src.schemas.schemas import SchemeUser


async def service_get_user_by_login(login: str, db: Session):
    user = db.query(User).filter(User.login == login).first()
    return user


async def service_create_token(user: User):
    user_object = SchemeUser.from_orm(user)
    token = _jwt.encode(user_object.dict(), SECRET_KEY)
    return dict(access_token=token, token_type="bearer")


async def service_get_user_by_id(id: int, db: Session):
    user = db.query(User).filter(User.id == id).first()
    return user


def service_oauth2scheme():
    return security.OAuth2PasswordBearer(tokenUrl="/api/user/token")
