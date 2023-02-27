import requests
from sqlalchemy.orm import Session
from datetime import date
from src.model.model import Feedback
from src.schemas.routers import SchemeFeedbackPostRouter
from settings_env import RECAPTCHA_SECRET_KEY


async def service_post_feedback(feedback: SchemeFeedbackPostRouter, db: Session):
    r = requests.post(f"https://www.google.com/recaptcha/api/siteverify", data={
        'secret': RECAPTCHA_SECRET_KEY,
        'response': feedback.token
    })
    if r.json()['success']:
        feedback_model = Feedback(
            name=feedback.feedback.name,
            mail=feedback.feedback.mail,
            message=feedback.feedback.message,
            date=date.today(),
            solved=False
        )
        db.add(feedback_model)
        db.commit()
        return dict(message='OK')
    else:
        return False
