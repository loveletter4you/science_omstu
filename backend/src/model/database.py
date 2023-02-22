from sqlalchemy import create_engine, orm
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

from settings_env import DB_NAME, DB_HOST, DB_ROOT, DB_PASSWORD


DATABASE_URL: str = f"postgresql+psycopg2://{DB_ROOT}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
Base = declarative_base()

engine = create_engine(DATABASE_URL)

session_local = orm.sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )


def create_db():
    Base.metadata.create_all(engine)


def get_db():
    session: Session = session_local()
    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
