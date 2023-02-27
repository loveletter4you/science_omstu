import requests
from sqlalchemy.orm import Session

from src.model.database import get_db
from src.schemas.routers import SchemeFeedbackPostRouter
from settings_env import RECAPTCHA_SECRET_KEY


async def service_post_feedback(feedback: SchemeFeedbackPostRouter, db: Session):
    r = requests.post(f"https://www.google.com/recaptcha/api/siteverify", data={
        'secret': RECAPTCHA_SECRET_KEY,
        'response': feedback.token
    })
    if r.json()['success']:
        return dict(message='OK')
    else:
        return False
