from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.model.database import create_db
from src.routers import author, publication, source, feedback, user, admin, analysis

create_db()
app = FastAPI()

app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(feedback.router)
app.include_router(author.router)
app.include_router(publication.router)
app.include_router(source.router)
app.include_router(user.router)
app.include_router(admin.router)
app.include_router(analysis.router)
