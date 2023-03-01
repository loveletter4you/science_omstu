from sqlalchemy import desc
from sqlalchemy.orm import Session
from passlib.hash import bcrypt

from settings_env import ADMIN_LOGIN, ADMIN_PASSWORD
from src.model.model import Role, User, Feedback
from src.schemas.schemas import SchemeFeedbackOutput


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
