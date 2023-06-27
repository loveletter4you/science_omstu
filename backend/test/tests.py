import asyncio
import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker

from settings_env import ADMIN_LOGIN, ADMIN_PASSWORD
from src.model.database import Base
from src.model.database import get_db
from main import app
from src.routers.admin.service import service_create_admin

basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URL = 'sqlite+aiosqlite:///' + os.path.join(basedir, 'data.sqlite')

engine_local = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
)

class CookieConfigurableTestClient(TestClient):
    _access_token = None

    def set_access_token(self, token):
        self._access_token = token

    def reset(self):
        self._access_token = None

    def request(self, *args, **kwargs):
        cookies = kwargs.get("cookies")
        if cookies is None and self._access_token:
            kwargs["cookies"] = {"access_token": self._access_token}

        return super().request(*args, **kwargs)


TestingSessionLocal = sessionmaker(class_=AsyncSession, bind=engine_local)


async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session


async def init_base():
    async with engine_local.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        db = TestingSessionLocal()
        await service_create_admin(db)


loop = asyncio.get_event_loop()
loop.run_until_complete(init_base())
loop.close()

app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session")
def client():
    with CookieConfigurableTestClient(app) as c:
        yield c


def test_login(client):
    response = client.post(
        "/api/user/token",
        data={"username": ADMIN_LOGIN, "password": ADMIN_PASSWORD},
        headers={"content-type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200, response.text


def test_author_create(client):
    response = client.post(
        "/api/author/",
        data={"name": "Иван", "surname": "Иванов", "patronymic": "Иванович", "confirmed": "false"}
    )
    assert response.status_code == 200, response.text
