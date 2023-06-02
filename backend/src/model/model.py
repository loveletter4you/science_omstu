from sqlalchemy import Column, String, Boolean, Integer, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from passlib.hash import bcrypt

from src.model.database import Base


class Role(Base):
    __tablename__ = "role"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    users = relationship("User", backref='role')


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    email = Column(String)
    login = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    role_id = Column(Integer, ForeignKey('role.id'))
    author = relationship("Author", uselist=False)

    def verify_password(self, password: str):
        return bcrypt.verify(password, self.password)


class Author(Base):
    __tablename__ = "author"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    patronymic = Column(String)
    birthday = Column(Date)
    confirmed = Column(Boolean, nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'))
    author_identifiers = relationship("AuthorIdentifier", backref='author')
    author_publications = relationship("AuthorPublication", backref='author')
    author_departments = relationship("AuthorDepartment", backref='author')


class Faculty(Base):
    __tablename__ = "faculty"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    departments = relationship("Department", backref='faculty')


class Department(Base):
    __tablename__ = "department"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    faculty_id = Column(Integer, ForeignKey('faculty.id'), nullable=False)
    department_authors = relationship("AuthorDepartment", backref='department')


class AuthorDepartment(Base):
    __tablename__ = "author_department"
    id = Column(Integer, primary_key=True)
    position = Column(String)
    rate = Column(Float, default='1', nullable=False)
    author_id = Column(Integer, ForeignKey('author.id'), nullable=False)
    department_id = Column(Integer, ForeignKey('department.id'), nullable=False)


class Identifier(Base):
    __tablename__ = "identifier"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    author_identifiers = relationship("AuthorIdentifier", backref='identifier')


class AuthorIdentifier(Base):
    __tablename__ = "author_identifier"
    id = Column(Integer, primary_key=True)
    author_id = Column(Integer, ForeignKey('author.id'), nullable=False)
    identifier_id = Column(Integer, ForeignKey('identifier.id'), nullable=False)
    identifier_value = Column(String)


class SourceType(Base):
    __tablename__ = "source_type"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    sources = relationship("Source", backref="source_type")


class SourceLinkType(Base):
    __tablename__ = "source_link_type"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    source_links = relationship("SourceLink", backref='source_link_type')


class SourceRatingType(Base):
    __tablename__ = "source_rating_type"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    source_ratings = relationship("SourceRating", backref='source_rating_type')


class Source(Base):
    __tablename__ = "source"
    id = Column(Integer, primary_key=True)
    source_type_id = Column(Integer, ForeignKey('source_type.id'), nullable=False)
    name = Column(String, nullable=False)
    source_links = relationship("SourceLink", backref='source')
    source_ratings = relationship("SourceRating", backref='source')
    publications = relationship("Publication", backref='source')


class SourceLink(Base):
    __tablename__ = "source_link"
    id = Column(Integer, primary_key=True)
    source_id = Column(Integer, ForeignKey('source.id'), nullable=False)
    source_link_type_id = Column(Integer, ForeignKey('source_link_type.id'), nullable=False)
    link = Column(String, nullable=False)


class SourceRating(Base):
    __tablename__ = "source_rating"
    id = Column(Integer, primary_key=True)
    source_id = Column(Integer, ForeignKey('source.id'), nullable=False)
    source_rating_type_id = Column(Integer, ForeignKey('source_rating_type.id'), nullable=False)
    rating = Column(String, nullable=False)
    rating_date = Column(Date, nullable=False)


class PublicationType(Base):
    __tablename__ = "publication_type"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    publications = relationship("Publication", backref='publication_type')


class Publication(Base):
    __tablename__ = "publication"
    id = Column(Integer, primary_key=True)
    type_id = Column(Integer, ForeignKey('publication_type.id'), nullable=False)
    source_id = Column(Integer, ForeignKey('source.id'), nullable=False)
    title = Column(String, nullable=False)
    abstract = Column(String)
    publication_date = Column(Date, nullable=False)
    accepted = Column(Boolean, nullable=False)
    keyword_publications = relationship("KeywordPublication", backref="publication")
    publication_authors = relationship("AuthorPublication", backref="publication")
    publication_links = relationship("PublicationLink", backref="publication")


class Keyword(Base):
    __tablename__ = "keyword"
    id = Column(Integer, primary_key=True)
    keyword = Column(String, nullable=False, unique=True)
    keyword_publications = relationship("KeywordPublication", backref="keyword")


class KeywordPublication(Base):
    __tablename__ = "keywords_publication"
    id = Column(Integer, primary_key=True)
    publication_id = Column(Integer, ForeignKey("publication.id"), nullable=False)
    keyword_id = Column(Integer, ForeignKey("keyword.id"), nullable=False)


class Organization(Base):
    __tablename__ = "organization"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    country = Column(String)
    city = Column(String)
    author_publication_organizations = relationship("AuthorPublicationOrganization", backref="organization")


class AuthorPublication(Base):
    __tablename__ = "author_publication"
    id = Column(Integer, primary_key=True)
    author_id = Column(Integer, ForeignKey("author.id"), nullable=False)
    publication_id = Column(Integer, ForeignKey("publication.id"), nullable=False)
    author_publication_organizations = relationship("AuthorPublicationOrganization", backref="author_publication")


class AuthorPublicationOrganization(Base):
    __tablename__ = "author_publication_organization"
    id = Column(Integer, primary_key=True)
    author_publication_id = Column(Integer, ForeignKey("author_publication.id"), nullable=False)
    organization_id = Column(Integer, ForeignKey("organization.id"), nullable=False)


class PublicationLinkType(Base):
    __tablename__ = "publication_link_type"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    publication_links = relationship("PublicationLink", backref="publication_link_type")


class PublicationLink(Base):
    __tablename__ = "publication_link"
    id = Column(Integer, primary_key=True)
    publication_id = Column(Integer, ForeignKey("publication.id"), nullable=False)
    link_type_id = Column(Integer, ForeignKey("publication_link_type.id"), nullable=False)
    link = Column(String, nullable=False)


class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    mail = Column(String, nullable=False)
    message = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    solved = Column(Boolean, nullable=False)
