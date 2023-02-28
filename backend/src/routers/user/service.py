from fastapi import security
from sqlalchemy import desc
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
import jwt as _jwt

from settings_env import ADMIN_LOGIN, ADMIN_PASSWORD, SECRET_KEY
from src.model.model import Role, User, Feedback
from src.schemas.schemas import SchemeUser, SchemeFeedbackOutput


async def service_create_admin(db: Session):
    admin_role = db.query(Role).filter(Role.name == "Admin").first()
    if admin_role is None:
        admin_role = Role(name="Admin")
        db.add(admin_role)
        db.commit()
    admin = db.query(User).filter(User.login == ADMIN_LOGIN).first()
    if admin is None:
        admin = User(login=ADMIN_LOGIN, password=bcrypt.hash(ADMIN_PASSWORD), role=admin_role)
        db.add(admin)
        db.commit()
    return dict(message="OK")


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


async def service_admin_check(role_id: int, db: Session):
    role = db.query(Role).filter(Role.id == role_id).first()
    if role is None:
        return False
    if role.name == "Admin":
        return True
    return False


async def service_get_feedbacks(offset: int, limit: int, solved: bool, db: Session):
    query = db.query(Feedback).filter(Feedback.solved == solved).order_by(desc(Feedback.date))
    feedbacks = query.offset(offset).limit(limit).all()
    scheme_feedbacks = [SchemeFeedbackOutput.from_orm(feedback) for feedback in feedbacks]
    count = query.count()
    return dict(feedbacks=scheme_feedbacks, count=count)


def service_oauth2scheme():
    return security.OAuth2PasswordBearer(tokenUrl="/api/user/token")

