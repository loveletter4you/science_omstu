from sqlalchemy import Column, String, Boolean, Integer, Date, ForeignKey, Float
from sqlalchemy.orm import Relationship
from passlib.hash import bcrypt

from src.model.database import Base


class Role(Base):
    __tablename__ = "role"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    users = Relationship("User", backref='role')


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    email = Column(String)
    login = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    role_id = Column(Integer, ForeignKey('role.id'))
    author = Relationship("Author", uselist=False)

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
    author_identifiers = Relationship("AuthorIdentifier", backref='author', cascade='save-update, merge, delete')
    author_publications = Relationship("AuthorPublication", backref='author', cascade='save-update, merge, delete')
    author_departments = Relationship("AuthorDepartment", backref='author', cascade='save-update, merge, delete')


class Faculty(Base):
    __tablename__ = "faculty"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    departments = Relationship("Department", backref='faculty')


class Department(Base):
    __tablename__ = "department"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    faculty_id = Column(Integer, ForeignKey('faculty.id'), nullable=False)
    department_authors = Relationship("AuthorDepartment", backref='department')


class AuthorDepartment(Base):
    __tablename__ = "author_department"
    id = Column(Integer, primary_key=True)
    position = Column(String)
    rate = Column(Float, default=1.0, nullable=False)
    author_id = Column(Integer, ForeignKey('author.id'), nullable=False)
    department_id = Column(Integer, ForeignKey('department.id'), nullable=False)


class Identifier(Base):
    __tablename__ = "identifier"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    author_identifiers = Relationship("AuthorIdentifier", backref='identifier')


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
    sources = Relationship("Source", backref="source_type")


class SourceLinkType(Base):
    __tablename__ = "source_link_type"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    source_links = Relationship("SourceLink", backref='source_link_type')


class SourceRatingType(Base):
    __tablename__ = "source_rating_type"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    source_ratings = Relationship("SourceRating", backref='source_rating_type')


class Source(Base):
    __tablename__ = "source"
    id = Column(Integer, primary_key=True)
    source_type_id = Column(Integer, ForeignKey('source_type.id'), nullable=False)
    name = Column(String, nullable=False)
    source_links = Relationship("SourceLink", backref='source')
    source_ratings = Relationship("SourceRating", backref='source')
    publications = Relationship("Publication", backref='source')


class SourceLink(Base):
    __tablename__ = "source_link"
    id = Column(Integer, primary_key=True)
    source_id = Column(Integer, ForeignKey('source.id'), nullable=False)
    source_link_type_id = Column(Integer, ForeignKey('source_link_type.id'), nullable=False)
    link = Column(String, nullable=False)


class SourceRatingDate(Base):
    __tablename__ = 'source_rating_date'
    id = Column(Integer, primary_key=True)
    source_rating_id = Column(Integer, ForeignKey('source_rating.id'), nullable=False)
    rating_date = Column(Date, nullable=False)
    to_rating_date = Column(Date, nullable=False)
    active = Column(Boolean, nullable=False)


class SourceRatingSubject(Base):
    __tablename__ = 'source_rating_subject'
    id = Column(Integer, primary_key=True)
    source_rating_id = Column(Integer, ForeignKey('source_rating.id'), nullable=False)
    subject_id = Column(Integer, ForeignKey('subject.id'), nullable=False)
    active = Column(Boolean, nullable=False)
    rating_date = Column(Date, nullable=False)
    to_rating_date = Column(Date, nullable=False)


class SourceRating(Base):
    __tablename__ = "source_rating"
    id = Column(Integer, primary_key=True)
    source_id = Column(Integer, ForeignKey('source.id'), nullable=False)
    source_rating_type_id = Column(Integer, ForeignKey('source_rating_type.id'), nullable=False)
    rating = Column(String)
    source_rating_dates = Relationship("SourceRatingDate", backref='source_rating')
    source_rating_subjects = Relationship("SourceRatingSubject", backref='source_rating')


class Subject(Base):
    __tablename__ = "subject"
    id = Column(Integer, primary_key=True)
    subject_type_id = Column(Integer, ForeignKey('subject_type.id'))
    subj_code = Column(String, nullable=False)
    name = Column(String, nullable=False)
    source_rating_subjects = Relationship("SourceRatingSubject", backref='subject')


class SubjectType(Base):
    __tablename__ = "subject_type"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    subject = Relationship("Subject", backref='subject')


class PublicationType(Base):
    __tablename__ = "publication_type"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    view_id = Column(Integer, ForeignKey('publication_type_view.id'))
    publications = Relationship("Publication", backref='publication_type')


class PublicationTypeView(Base):
    __tablename__ = "publication_type_view"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    publication_types = Relationship("PublicationType", backref='publication_type_view')


class Publication(Base):
    __tablename__ = "publication"
    id = Column(Integer, primary_key=True)
    type_id = Column(Integer, ForeignKey('publication_type.id'), nullable=False)
    source_id = Column(Integer, ForeignKey('source.id'), nullable=False)
    title = Column(String, nullable=False)
    abstract = Column(String)
    publication_date = Column(Date, nullable=False)
    accepted = Column(Boolean, nullable=False)
    rate = Column(Float)
    keyword_publications = Relationship("KeywordPublication", backref="publication")
    publication_authors = Relationship("AuthorPublication", backref="publication")
    publication_links = Relationship("PublicationLink", backref="publication")


class Keyword(Base):
    __tablename__ = "keyword"
    id = Column(Integer, primary_key=True)
    keyword = Column(String, nullable=False, unique=True)
    keyword_publications = Relationship("KeywordPublication", backref="keyword")
    keyword_nioktr = Relationship("KeywordNioktr", backref="keyword")


class KeywordPublication(Base):
    __tablename__ = "keywords_publication"
    id = Column(Integer, primary_key=True)
    publication_id = Column(Integer, ForeignKey("publication.id"), nullable=False)
    keyword_id = Column(Integer, ForeignKey("keyword.id"), nullable=False)


class KeywordNioktr(Base):
    __tablename__ = "keywords_nioktr"
    id = Column(Integer, primary_key=True)
    nioktr_id = Column(Integer, ForeignKey("nioktr.id"), nullable=False)
    keyword_id = Column(Integer, ForeignKey("keyword.id"), nullable=False)


class Organization(Base):
    __tablename__ = "organization"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    country = Column(String)
    city = Column(String)
    ogrn = Column(Integer, nullable=True)
    inn = Column(Integer, nullable=True)
    organization_coexecutor = Relationship("OrganizationCoexecutor", backref='organization')
    author_publication_organizations = Relationship("AuthorPublicationOrganization", backref="organization")
    organization_identifiers = Relationship("OrganizationIdentifier", backref='organization')


class OrganizationCoexecutor(Base):
    __tablename__ = "organization_coexecutor"
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey("organization.id"), nullable=False)
    coexecutor_id = Column(Integer, ForeignKey("coexecutor.id"), nullable=False)


class Coexecutor(Base):
    __tablename__ = "coexecutor"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    short_name = Column(String, nullable=False, unique=True)
    ogrn = Column(Integer, nullable=True)
    inn = Column(Integer, nullable=True)
    organization_coexecutor = Relationship("OrganizationCoexecutor", backref='coexecutor')


class AuthorPublication(Base):
    __tablename__ = "author_publication"
    id = Column(Integer, primary_key=True)
    author_id = Column(Integer, ForeignKey("author.id"), nullable=False)
    publication_id = Column(Integer, ForeignKey("publication.id"), nullable=False)
    author_publication_organizations = Relationship("AuthorPublicationOrganization", backref="author_publication")


class AuthorPublicationOrganization(Base):
    __tablename__ = "author_publication_organization"
    id = Column(Integer, primary_key=True)
    author_publication_id = Column(Integer, ForeignKey("author_publication.id"), nullable=False)
    organization_id = Column(Integer, ForeignKey("organization.id"), nullable=False)


class PublicationLinkType(Base):
    __tablename__ = "publication_link_type"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    publication_links = Relationship("PublicationLink", backref="publication_link_type")


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


class Nioktr(Base):
    __tablename__ = "nioktr"
    id = Column(Integer, primary_key=True)
    work_supervisor_id = Column(Integer, ForeignKey("author.id"), nullable=False)
    organization_supervisor_id = Column(Integer, ForeignKey("author.id"), nullable=False)
    organization_executor_id = Column(Integer, ForeignKey("organization.id"), nullable=False)

    rosrid_id = Column(String)
    name = Column(String, nullable=False)
    annotation = Column(String)
    created_date = Column(Date, nullable=False)
    document_date = Column(Date, nullable=False)
    work_start_date = Column(Date, nullable=False)
    work_end_date = Column(Date, nullable=False)
    contract_number = Column(String)
    customer_name = Column(String)

    types_nioktrs = Relationship("NioktrTypes", backref="nioktr")
    keyword_nioktrs = Relationship("KeywordNioktr", backref="nioktr")
    priority_nioktrs = Relationship("NioktrPriorityDirections", backref="nioktr")
    tech_id = Relationship("NioktrCriticalTechnologies", backref="nioktr")
    nioktr_budget = Relationship("NioktrBudget", backref="nioktr")


class OrganizationIdentifier(Base):
    __tablename__ = "organization_identifier"
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey('organization.id'), nullable=False)
    identifier_id = Column(Integer, ForeignKey('identifier.id'), nullable=False)
    identifier_value = Column(String)


class BudgetType(Base):
    __tablename__ = "budget_type"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    nioktr_budget = Relationship("NioktrBudget", backref='budget_type')


class NioktrBudget(Base):
    __tablename__ = "nioktr_budget"
    id = Column(Integer, primary_key=True)
    funds = Column(Integer, nullable=False)
    kbk = Column(String, nullable=False)
    budget_type_id = Column(Integer, ForeignKey("budget_type.id"), nullable=False)
    nioktr_id = Column(Integer, ForeignKey("nioktr.id"), nullable=False)


class NioktrTypes(Base):
    __tablename__ = "nioktr_types"
    id = Column(Integer, primary_key=True)
    nioktr_id = Column(Integer, ForeignKey("nioktr.id"), nullable=False)
    types_n_id = Column(Integer, ForeignKey("types_n.id"), nullable=False)


class NioktrPriorityDirections(Base):
    __tablename__ = "nioktr_priority_directions"
    id = Column(Integer, primary_key=True)
    nioktr_id = Column(Integer, ForeignKey("nioktr.id"), nullable=False)
    priority_directions_id = Column(Integer, ForeignKey("priority_directions.id"), nullable=False)


class NioktrCriticalTechnologies(Base):
    __tablename__ = "nioktr_critical_tech"
    id = Column(Integer, primary_key=True)
    critical_tech_id = Column(Integer, ForeignKey("critical_tech.id"), nullable=False)
    nioktr_id = Column(Integer, ForeignKey("nioktr.id"), nullable=False)


class CriticalTechnologies(Base):
    __tablename__ = "critical_tech"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    nioktr_critical_tech = Relationship("NioktrCriticalTechnologies", backref='critical_tech')


class PriorityDirections(Base):
    __tablename__ = "priority_directions"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    nioktr_priority_directions = Relationship("NioktrPriorityDirections", backref='priority_directions')


class TypesN(Base):
    __tablename__ = "types_n"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    nioktr_types = Relationship("NioktrTypes", backref='types_n')
