from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from settings_env import DB_NAME, DB_HOST, DB_ROOT, DB_PASSWORD


DATABASE_URL: str = f"postgresql+asyncpg://{DB_ROOT}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
Base = declarative_base()

engine = create_async_engine(DATABASE_URL)

session_local = sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )


async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    async with session_local() as session:
        yield session
