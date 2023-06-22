from sqlalchemy import desc
from sqlalchemy.ext.asyncio import AsyncSession as Session

from src.model.model import Department, Faculty, Publication, Author, AuthorPublication, AuthorDepartment
from src.schemas.schemas import SchemeDepartment, SchemeFaculty, SchemePublication, SchemeAuthor


async def service_get_faculties(offset: int, limit: int, db: Session):
    query = db.query(Faculty).order_by(Faculty.id)
    faculties_count = query.count()
    faculties = query.offset(offset).limit(limit).all()
    faculties_schemas = [SchemeFaculty.from_orm(faculty) for faculty in faculties]
    return dict(faculties=faculties_schemas, count=faculties_count)


async def service_get_departments(offset: int, limit: int, db: Session):
    query = db.query(Department).join(Faculty).order_by(Faculty.id)
    departments_count = query.count()
    departments = query.offset(offset).limit(limit).all()
    departments_schemas = [SchemeDepartment.from_orm(department) for department in departments]
    return dict(departments=departments_schemas, count=departments_count)


async def service_get_faculty(id: int, db: Session):
    faculty = db.query(Faculty).filter(Faculty.id == id).first()
    if faculty is None:
        return None
    departments = db.query(Department).filter(Department.faculty_id == id).all()
    return dict(faculty=faculty, departments=departments)


async def service_get_department_publications(id: int, offset: int, limit: int, db: Session):
    department = db.query(Department).filter(Department.id == id).first()
    if department is None:
        return None
    query = db.query(Publication).join(AuthorPublication).join(Author).join(AuthorDepartment)\
        .filter(AuthorDepartment.department_id == department.id).order_by(desc(Publication.publication_date))\
        .distinct()
    publications = query.offset(offset).limit(limit).all()
    scheme_publications = [SchemePublication.from_orm(publication) for publication in publications]
    count = query.count()
    return dict(publications=scheme_publications, count=count)


async def service_get_department_authors(id: int, db: Session):
    department = db.query(Department).filter(Department.id == id).first()
    if department is None:
        return None
    query = db.query(Author).join(AuthorDepartment).filter(AuthorDepartment.department_id == department.id).distinct()
    authors_count = query.count()
    authors = query.all()
    scheme_authors = [SchemeAuthor.from_orm(author) for author in authors]
    return dict(authors=scheme_authors, count=authors_count)
