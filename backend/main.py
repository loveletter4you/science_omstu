from fastapi import FastAPI
from src.model.database import create_db
from src.routers import author, publication, source, feedback, user
from src.routers.user.service import service_create_admin

create_db()
app = FastAPI()

app.include_router(feedback.router)
app.include_router(author.router)
app.include_router(publication.router)
app.include_router(source.router)
app.include_router(user.router)
