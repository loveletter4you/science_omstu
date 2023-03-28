import pandas as pd
import numpy as np
from fastapi import UploadFile
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

import datetime

from src.model.model import Identifier, Source, SourceLink, Publication, PublicationLink, \
    AuthorIdentifier, AuthorPublication, Author, AuthorPublicationOrganization, Keyword, \
    KeywordPublication, SourceRating, Organization, Department, Faculty, AuthorDepartment
from src.model.storage import get_or_create_publication_link_type, get_or_create_source_type, \
    get_or_create_source_link_type, get_or_create_identifier, get_or_create_source_rating_type, \
    get_or_create_organization_omstu, get_source_by_name_or_identifiers, get_or_create_publication_type, \
    create_publication, create_publication_link


async def service_fill_scopus(date: datetime.date, file: UploadFile, db: Session):
    scopus_df = pd.read_csv(file.file, on_bad_lines='skip')
    scopus_df = scopus_df.replace(np.nan, "")

    pub_link_type_doi = get_or_create_publication_link_type("DOI", db)
    pub_link_type_scopus = get_or_create_publication_link_type("Scopus", db)
    source_type_journal = get_or_create_source_type("Журнал", db)
    source_type_conference = get_or_create_source_type("Конференция", db)
    source_link_type_issn = get_or_create_source_link_type("ISSN", db)
    identifier_scopus = get_or_create_identifier("Scopus Author ID", db)
    organization_omstu = get_or_create_organization_omstu(db)

    for _, row in scopus_df.iterrows():
        issn = str(row['ISSN']).rjust(8, '0')
        issn = issn[:4] + '-' + issn[4:]
        source = get_source_by_name_or_identifiers(str(row['Source title']), [issn], db)
        if source is None:
            source = Source(name=row['Source title'])
            if row['Document Type'] == "Conference Paper":
                source.source_type = source_type_conference
            else:
                source.source_type = source_type_journal
            db.add(source)
            if row['ISSN'] != "":
                source_link = SourceLink(
                    source=source,
                    source_link_type=source_link_type_issn,
                    link=issn
                )
                db.add(source_link)
            db.commit()
        publication_type = get_or_create_publication_type(row["Document Type"], db)
        date = datetime.date(int(row['Year']), 1, 1)
        if row['DOI'] != "":
            link_doi = db.query(PublicationLink).filter(PublicationLink.link == row['DOI']).first()
            if link_doi is not None:
                continue
        link_scopus = db.query(PublicationLink).filter(PublicationLink.link == row['Link']).first()
        if link_scopus is not None:
            continue
        publication = db.query(Publication).filter(or_(Publication.title.ilike(row['Title']))).first()
        if publication is not None:
            continue
        publication = create_publication(publication_type, source, row["Title"], row["Abstract"], date, True, db)
        create_publication_link(publication, pub_link_type_scopus, row["Link"], db)
        if row['DOI'] != "":
            create_publication_link(publication, pub_link_type_doi, row["DOI"], db)
        authors_orgs = row['Authors with affiliations'].split(';')
        authors_scopus = row['Author(s) ID'].split(';')
        for i, author_row in enumerate(authors_orgs):
            if i >= len(authors_scopus):
                continue
            author_data = author_row.split(', ')
            identifier = db.query(AuthorIdentifier).\
                filter(and_(AuthorIdentifier.identifier_id == identifier_scopus.id,
                       AuthorIdentifier.identifier_value == authors_scopus[i])).first()
            author: Author
            if identifier is None:
                author: Author
                if len(author_data) > 1:
                    author = Author(
                        name=author_data[1],
                        surname=author_data[0],
                        confirmed=False
                    )
                else:
                    author = Author(
                        name='-',
                        surname=author_data[0],
                        confirmed=False
                    )
                db.add(author)
                author_identifier = AuthorIdentifier(
                    author=author,
                    identifier=identifier_scopus,
                    identifier_value=authors_scopus[i]
                )
                db.add(author_identifier)
            else:
                author = identifier.author
            author_publication = AuthorPublication(
                publication=publication,
                author=author
            )
            db.add(author_publication)
            if 'Omsk State Technical University' in author_data:
                author_publication_organization = AuthorPublicationOrganization(
                    author_publication=author_publication,
                    organization=organization_omstu
                )
                db.add(author_publication_organization)
            elif len(author_data) > 2:
                organization = db.query(Organization).filter(Organization.name == author_data[2]).first()
                if organization is None:
                    organization = Organization(name=author_data[2])
                    db.add(organization)
                author_publication_organization = AuthorPublicationOrganization(
                    author_publication=author_publication,
                    organization=organization
                )
                db.add(author_publication_organization)
            db.commit()
        if row['Author Keywords'] != "":
            keywords = set(row['Author Keywords'].split('; '))
            for keyword_value in keywords:
                keyword = db.query(Keyword).filter(Keyword.keyword == keyword_value).first()
                if keyword is None:
                    keyword = Keyword(
                        keyword=keyword_value
                    )
                    db.add(keyword)
                publication_keyword = KeywordPublication(
                    publication=publication,
                    keyword=keyword
                )
                db.add(publication_keyword)
        db.commit()
    db.commit()
    return {'Message': 'OK'}


async def service_fill_authors(file: UploadFile, db: Session):
    author_df = pd.read_csv(file.file)
    author_df = author_df.replace(np.nan, "")
    identifier_spin = db.query(Identifier).filter(Identifier.name == "SPIN-код").first()
    if identifier_spin is None:
        identifier_spin = Identifier(name="SPIN-код")
        db.add(identifier_spin)
    identifier_orcid = db.query(Identifier).filter(Identifier.name == "ORCID").first()
    if identifier_orcid is None:
        identifier_orcid = Identifier(name="ORCID")
        db.add(identifier_orcid)
    identifier_scopus = db.query(Identifier).filter(Identifier.name == "Scopus Author ID").first()
    if identifier_scopus is None:
        identifier_scopus = Identifier(name="Scopus Author ID")
        db.add(identifier_scopus)
    identifier_researcher = db.query(Identifier).filter(Identifier.name == "ResearcherID").first()
    if identifier_researcher is None:
        identifier_researcher = Identifier(name="ResearcherID")
        db.add(identifier_researcher)
    for _, row in author_df.iterrows():
        author = db.query(Author).filter(and_(Author.name == row['name'].title(),
                                              Author.surname == row['surname'].title(),
                                              Author.patronymic == row['patronymic'].title())).first()
        if author is None:
            author = Author(
                name=row['name'].title(),
                surname=row['surname'].title(),
                patronymic=row['patronymic'].title(),
                confirmed=True
            )
            db.add(author)
            db.commit()
        if row['faculty'] != "":
            faculty = db.query(Faculty).filter(Faculty.name == row['faculty']).first()
            if faculty is None:
                faculty = Faculty(name=row['faculty'])
                db.add(faculty)
                db.commit()
            department = db.query(Department).filter(and_(Department.name == row['department'],
                                                          Department.faculty == faculty)).first()
            if department is None:
                department = Department(
                    name=row['department'],
                    faculty=faculty
                )
                db.add(department)
                db.commit()
            author_department = db.query(AuthorDepartment).filter(and_(AuthorDepartment.department == department,
                                                                       AuthorDepartment.author == author)).first()
            if author_department is None:
                author_department = AuthorDepartment(
                    department=department,
                    author=author,
                    position=row['position']
                )
                db.add(author_department)
        if str(row['spin']) != "0":
            author_identifier_spin = db.query(AuthorIdentifier)\
                .filter(and_(AuthorIdentifier.author == author,
                             AuthorIdentifier.identifier == identifier_spin,
                             AuthorIdentifier.identifier_value == str(row['spin']))).first()
            if author_identifier_spin is None:
                author_identifier_spin = AuthorIdentifier(
                    author=author,
                    identifier=identifier_spin,
                    identifier_value=row['spin']
                )
                db.add(author_identifier_spin)
        if str(row['orcid']) != "0":
            author_identifier_orcid = db.query(AuthorIdentifier) \
                .filter(and_(AuthorIdentifier.author == author,
                             AuthorIdentifier.identifier == identifier_orcid,
                             AuthorIdentifier.identifier_value == str(row['orcid']))).first()
            if author_identifier_orcid is None:
                author_identifier_orcid = AuthorIdentifier(
                    author=author,
                    identifier=identifier_orcid,
                    identifier_value=row['orcid']
                )
                db.add(author_identifier_orcid)
        if str(row['scopus author id']) != "0":
            author_identifier_scopus = db.query(AuthorIdentifier) \
                .filter(and_(AuthorIdentifier.author == author,
                             AuthorIdentifier.identifier == identifier_scopus,
                             AuthorIdentifier.identifier_value == str(row['scopus author id']))).first()
            if author_identifier_scopus is None:
                author_identifier_scopus = AuthorIdentifier(
                    author=author,
                    identifier=identifier_scopus,
                    identifier_value=row['scopus author id']
                )
                db.add(author_identifier_scopus)
        if str(row['researcher id']) != "0":
            author_identifier_researcher = db.query(AuthorIdentifier) \
                .filter(and_(AuthorIdentifier.author == author,
                             AuthorIdentifier.identifier == identifier_researcher,
                             AuthorIdentifier.identifier_value == str(row['researcher id']))).first()
            if author_identifier_researcher is None:
                author_identifier_researcher = AuthorIdentifier(
                    author=author,
                    identifier=identifier_researcher,
                    identifier_value=row['researcher id']
                )
                db.add(author_identifier_researcher)
        db.commit()
    return {"message": "OK"}


async def service_white_list_fill(date: datetime.date, file: UploadFile, db: Session):
    white_list_df = pd.read_csv(file.file, on_bad_lines='skip', sep='\t')
    white_list_df = white_list_df.replace(np.nan, "")
    white_list_rating_type = get_or_create_source_rating_type('«Белый список» РЦНИ', db)
    source_link_type_issn = get_or_create_source_link_type("ISSN", db)
    source_link_type_eissn = get_or_create_source_link_type("eISSN", db)
    source_type_journal = get_or_create_source_type("Журнал", db)
    for _, row in white_list_df.iterrows():
        issns = row['ISSN'].split('|')
        source = get_source_by_name_or_identifiers(str(row['Title']), issns, db)
        if not (source is None):
            source_rating_white_list = SourceRating(
                source_rating_type=white_list_rating_type,
                source=source,
                rating="Входит",
                rating_date=date
            )
            db.add(source_rating_white_list)
            continue
        else:
            source = Source(
                name=row['Title'],
                source_type=source_type_journal
            )
            db.add(source)
            source_rating_white_list = SourceRating(
                source_rating_type=white_list_rating_type,
                source=source,
                rating="Входит",
                rating_date=date
            )
            db.add(source_rating_white_list)
            if len(issns) > 1:
                source_link_issn = SourceLink(
                    source=source,
                    source_link_type=source_link_type_issn,
                    link=issns[0]
                )
                db.add(source_link_issn)
                source_link_eissn = SourceLink(
                    source=source,
                    source_link_type=source_link_type_eissn,
                    link=issns[1]
                )
                db.add(source_link_eissn)
            else:
                source_link_issn = SourceLink(
                    source=source,
                    source_link_type=source_link_type_issn,
                    link=issns[0]
                )
                db.add(source_link_issn)
    db.commit()
    return dict(message="OK")


async def service_fill_vak_journals_rank(date: datetime.date, file: UploadFile, db: Session):
    vak_df = pd.read_excel(file.file, 'rank')
    vak_df = vak_df.replace(np.nan, "")
    vak_rating_type = get_or_create_source_rating_type('ВАК', db)
    source_link_type_issn = get_or_create_source_link_type("ISSN", db)
    source_link_type_eissn = get_or_create_source_link_type("eISSN", db)
    source_type_journal = get_or_create_source_type("Журнал", db)
    for _, row in vak_df.iterrows():
        issns = row['issn'].split(',')
        source = get_source_by_name_or_identifiers(str(row['title']), issns, db)
        if not (source is None):
            source_rating_white_list = SourceRating(
                source_rating_type=vak_rating_type,
                source=source,
                rating=row['Q'],
                rating_date=date
            )
            db.add(source_rating_white_list)
            continue
        else:
            source = Source(
                name=row['title'],
                source_type=source_type_journal
            )
            db.add(source)
            source_rating_white_list = SourceRating(
                source_rating_type=vak_rating_type,
                source=source,
                rating=row['Q'],
                rating_date=date
            )
            db.add(source_rating_white_list)
            if len(issns) > 1:
                source_link_issn = SourceLink(
                    source=source,
                    source_link_type=source_link_type_issn,
                    link=issns[0]
                )
                db.add(source_link_issn)
                source_link_eissn = SourceLink(
                    source=source,
                    source_link_type=source_link_type_eissn,
                    link=issns[1]
                )
                db.add(source_link_eissn)
            else:
                source_link_issn = SourceLink(
                    source=source,
                    source_link_type=source_link_type_issn,
                    link=issns[0]
                )
                db.add(source_link_issn)
    db.commit()
    return dict(message='OK')


async def service_fill_rsci_journals_rank(date: datetime.date, file: UploadFile, db: Session):
    rsci_df = pd.read_csv(file.file, on_bad_lines='skip')
    rsci_df = rsci_df.replace(np.nan, "")
    rsci_rating_type = get_or_create_source_rating_type('RSCI', db)
    source_link_type_issn = get_or_create_source_link_type("ISSN", db)
    source_link_type_eissn = get_or_create_source_link_type("eISSN", db)
    source_type_journal = get_or_create_source_type("Журнал", db)
    for _, row in rsci_df.iterrows():
        issns = []
        if row['issn1'] != 'NA':
            issns.append(row['issn1'])
        if row['issn2'] != 'NA':
            issns.append(row['issn2'])
        source = get_source_by_name_or_identifiers(str(row['title']), issns, db)
        if not (source is None):
            source_rating_white_list = SourceRating(
                source_rating_type=rsci_rating_type,
                source=source,
                rating=f'OECD: {row["oecd"]}; Квартиль: {row["q"]}',
                rating_date=date
            )
            db.add(source_rating_white_list)
            continue
        else:
            source = Source(
                name=row['title'],
                source_type=source_type_journal
            )
            db.add(source)
            source_rating_white_list = SourceRating(
                source_rating_type=rsci_rating_type,
                source=source,
                rating=f'OECD: {row["oecd"]}; Квартиль: {row["q"]}',
                rating_date=date
            )
            db.add(source_rating_white_list)
            if row['issn1'] != 'NA':
                source_link_issn = SourceLink(
                    source=source,
                    source_link_type=source_link_type_issn,
                    link=row['issn1']
                )
                db.add(source_link_issn)
            if row['issn2'] != 'NA':
                source_link_issn = SourceLink(
                    source=source,
                    source_link_type=source_link_type_eissn,
                    link=row['issn2']
                )
                db.add(source_link_issn)
    db.commit()
    return dict(message="OK")


async def service_white_list_jcr_citescore(date: datetime.date, file: UploadFile, db: Session):
    white_list_df = pd.read_csv(file.file, on_bad_lines='skip')
    white_list_df = white_list_df.replace(np.nan, "")
    white_list_rating_type = get_or_create_source_rating_type('«Белый список» РЦНИ', db)
    jcr_rating_type = get_or_create_source_rating_type('Journal Citation Reports WoS', db)
    citescore_rating_type = get_or_create_source_rating_type('CiteScore Scopus', db)
    source_link_type_issn = get_or_create_source_link_type("ISSN", db)
    source_link_type_eissn = get_or_create_source_link_type("eISSN", db)
    source_type_journal = get_or_create_source_type("Журнал", db)
    for _, row in white_list_df.iterrows():
        issns = row['ISSN'].split('|')
        source = get_source_by_name_or_identifiers(str(row['Title']), issns, db)
        if not (source is None):
            source_rating_white_list = SourceRating(
                source_rating_type=white_list_rating_type,
                source=source,
                rating="Входит",
                rating_date=date
            )
            db.add(source_rating_white_list)
            if row['Direction'] != "":
                source_rating_citescore = SourceRating(
                    source_rating_type=citescore_rating_type,
                    source=source,
                    rating=row['Direction'].replace('|', '; '),
                    rating_date=date
                )
                db.add(source_rating_citescore)
            if row['JCR categories'] != "":
                source_rating_jcr = SourceRating(
                    source_rating_type=jcr_rating_type,
                    source=source,
                    rating=row['JCR categories'],
                    rating_date=date
                )
                db.add(source_rating_jcr)
            continue
        else:
            source = Source(
                name=row['Title'],
                source_type=source_type_journal
            )
            db.add(source)
            source_rating_white_list = SourceRating(
                source_rating_type=white_list_rating_type,
                source=source,
                rating="Входит",
                rating_date=date
            )
            db.add(source_rating_white_list)
            if row['Direction'] != "":
                source_rating_citescore = SourceRating(
                    source_rating_type=citescore_rating_type,
                    source=source,
                    rating=row['Direction'].replace('|', '; '),
                    rating_date=date
                )
                db.add(source_rating_citescore)
            if row['JCR categories'] != "":
                source_rating_jcr = SourceRating(
                    source_rating_type=jcr_rating_type,
                    source=source,
                    rating=row['JCR categories'],
                    rating_date=date
                )
                db.add(source_rating_jcr)
            if len(issns) > 1:
                source_link_issn = SourceLink(
                    source=source,
                    source_link_type=source_link_type_issn,
                    link=issns[0]
                )
                db.add(source_link_issn)
                source_link_eissn = SourceLink(
                    source=source,
                    source_link_type=source_link_type_eissn,
                    link=issns[1]
                )
                db.add(source_link_eissn)
            else:
                source_link_issn = SourceLink(
                    source=source,
                    source_link_type=source_link_type_issn,
                    link=issns[0]
                )
                db.add(source_link_issn)
    db.commit()
    return dict(message="OK")


async def service_jcr_list_fill(date: datetime.date, file: UploadFile, db: Session):
    jcr_df = pd.read_excel(file.file)
    jcr_df = jcr_df.replace(np.nan, "")
    jcr_rating_type = get_or_create_source_rating_type('Journal Citation Reports WoS', db)
    source_link_type_issn = get_or_create_source_link_type("ISSN", db)
    source_link_type_eissn = get_or_create_source_link_type("eISSN", db)
    source_type_journal = get_or_create_source_type("Журнал", db)
    for _, row in jcr_df.iterrows():
        source = get_source_by_name_or_identifiers(str(row['Title']), [row['issn'], row['eissn']], db)
        if not (source is None):
            source_rating_white_list = SourceRating(
                source_rating_type=jcr_rating_type,
                source=source,
                rating=row['category'],
                rating_date=date
            )
            db.add(source_rating_white_list)
            continue
        source = Source(
            name=row['journal name'],
            source_type=source_type_journal
        )
        db.add(source)
        source_rating_white_list = SourceRating(
            source_rating_type=jcr_rating_type,
            source=source,
            rating=row['category'],
            rating_date=date
        )
        db.add(source_rating_white_list)
        if row['issn'] != "N/A":
            source_link_issn = SourceLink(
                source=source,
                source_link_type=source_link_type_issn,
                link=row['issn']
            )
            db.add(source_link_issn)
        if row['eissn'] != "N/A":
            source_link_issn = SourceLink(
                source=source,
                source_link_type=source_link_type_eissn,
                link=row['eissn']
            )
            db.add(source_link_issn)
    db.commit()
    return dict(message="OK")
