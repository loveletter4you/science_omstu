import datetime

import requests
from sqlalchemy import and_
from sqlalchemy.orm import Session

from src.model.model import Identifier, AuthorIdentifier, PublicationLink, Publication, Source, SourceLink, Author, \
    AuthorPublication, AuthorPublicationOrganization, Organization
from src.model.storage import get_or_create_publication_link_type, get_source_by_name_or_identifiers, \
    get_or_create_source_link_type, get_or_create_source_type, get_or_create_publication_type, create_publication, \
    create_publication_link, get_or_create_organization_omstu


def service_update_from_openalex(db: Session):
    identifier_orcid = db.query(Identifier).filter(Identifier.name == "ORCID").first()
    pub_link_type_doi = get_or_create_publication_link_type("DOI", db)
    source_link_type_issn = get_or_create_source_link_type("ISSN", db)
    source_link_type_eissn = get_or_create_source_link_type("eISSN", db)
    source_type_journal = get_or_create_source_type("Журнал", db)
    source_type_conference = get_or_create_source_type("Конференция", db)
    organization_omstu = get_or_create_organization_omstu(db)

    if identifier_orcid is None:
        return None
    orcids = db.query(AuthorIdentifier).join(Author).filter(AuthorIdentifier.identifier == identifier_orcid)\
        .filter(Author.confirmed).all()
    for orcid in orcids:
        filters = f'author.orcid:https://orcid.org/{orcid.identifier_value}'
        filtered_works_url = f'https://api.openalex.org/works?filter={filters}'
        cursor = '*'
        select = ",".join((
            'id',
            'doi',
            'ids',
            'title',
            'display_name',
            'publication_year',
            'publication_date',
            'primary_location',
            'host_venue',
            'type',
            'open_access',
            'authorships',
            'cited_by_count',
            'is_retracted',
            'is_paratext',
            'updated_date',
            'created_date',
            'abstract_inverted_index',
        ))
        works = []
        while cursor:
            url = f'{filtered_works_url}&select={select}&cursor={cursor}'
            page_with_results = requests.get(url, timeout=30).json()
            results = page_with_results['results']
            works.extend(results)

            cursor = page_with_results['meta']['next_cursor']

        for work in works:
            if work['doi']:
                doi = work['doi'].replace('https://doi.org/', '')
                link_doi = db.query(PublicationLink).filter(PublicationLink.link == doi).first()
                if link_doi is not None:
                    continue
            else:
                continue
            if not work['title']:
                continue
            publication = db.query(Publication).filter(Publication.title.ilike(work['title'])).first()
            if publication is not None:
                continue
            issns = work['host_venue']['issn']
            source_title = ''
            if work['host_venue']['display_name']:
                source_title = work['host_venue']['display_name']
            source = None
            if not (issns is None):
                source = get_source_by_name_or_identifiers(source_title, issns, db)
            if source is None:
                if source_title == '':
                    continue
                source = Source(name=source_title)
                if work['host_venue']['type'] == 'journal':
                    source.source_type = source_type_journal
                else:
                    source.source_type = source_type_conference
                db.add(source)
                if not (issns is None):
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
                    elif len(issns) == 1:
                        source_link_issn = SourceLink(
                            source=source,
                            source_link_type=source_link_type_issn,
                            link=issns[0]
                        )
                        db.add(source_link_issn)
            publication_type = get_or_create_publication_type(work["type"].replace('-', ' ').title(), db)
            date_values = [int(i) for i in work['publication_date'].split('-')]
            date = datetime.date(date_values[0], date_values[1], date_values[2])
            abstract: str | None
            if work['abstract_inverted_index']:
                abstract = inverted_index_to_string(work['abstract_inverted_index'])
            else:
                abstract = None
            publication = create_publication(publication_type, source, work['title'], abstract, date, True, db)
            create_publication_link(publication, pub_link_type_doi, work['doi'].replace('https://doi.org/', ''), db)
            for author in work['authorships']:
                author_db: Author | None
                author_name = "undefined undefined"
                if author['author']['display_name']:
                    author_name = author['author']['display_name'].split(' ', maxsplit=1)
                if author['author']['orcid']:
                    orcid = author['author']['orcid'].replace('https://orcid.org/', '')
                    identifier = db.query(AuthorIdentifier). \
                        filter(and_(AuthorIdentifier.identifier_id == identifier_orcid.id,
                                    AuthorIdentifier.identifier_value == orcid)).first()
                    if identifier is None:
                        if len(author_name) > 1:
                            author_db = Author(
                                name=author_name[1],
                                surname=author_name[0],
                                confirmed=False
                            )
                        else:
                            author_db = Author(
                                name='-',
                                surname=author_name[0],
                                confirmed=False
                            )
                        db.add(author_db)
                        author_identifier = AuthorIdentifier(
                            author=author_db,
                            identifier=identifier_orcid,
                            identifier_value=orcid
                        )
                        db.add(author_identifier)
                    else:
                        author_db = identifier.author
                else:
                    if len(author_name) > 1:
                        author_db = db.query(Author).filter(and_(Author.name == author_name[0],
                                                          Author.surname == author_name[1])).first()
                    else:
                        author_db = db.query(Author).filter(and_(Author.name == '-',
                                                                 Author.surname == author_name[0])).first()
                    if author_db is None:
                        if len(author_name) > 1:
                            author_db = Author(
                                name=author_name[0],
                                surname=author_name[1],
                                confirmed=False
                            )
                            db.add(author_db)
                        else:
                            author_db = Author(
                                name='-',
                                surname=author_name[0],
                                confirmed=False
                            )
                author_publication = AuthorPublication(
                    publication=publication,
                    author=author_db
                )
                db.add(author_publication)
                if not author['institutions']:
                    continue
                for institute in author['institutions']:
                    if institute['ror'] == 'https://ror.org/01kzjg088':
                        author_publication_organization = AuthorPublicationOrganization(
                            author_publication=author_publication,
                            organization=organization_omstu
                        )
                        db.add(author_publication_organization)
                    else:
                        organization = db.query(Organization)\
                            .filter(Organization.name == institute['display_name']).first()
                        if organization is None:
                            organization = Organization(name=institute['display_name'])
                            db.add(organization)
                        author_publication_organization = AuthorPublicationOrganization(
                            author_publication=author_publication,
                            organization=organization
                        )
                        db.add(author_publication_organization)
                    db.commit()
            db.commit()
    return {"message": "OK"}


def inverted_index_to_string(inverted_index):
    terms = sorted(list(inverted_index.keys()), key=lambda x: inverted_index[x][0])
    # Create an empty list to store the tokens
    tokens = {}
    # Iterate through the sorted terms
    for term in terms:
        # Iterate through the list of document positions and add the corresponding token
        for pos in inverted_index[term]:
            tokens[pos] = term

    # Join the tokens to form the string
    string = ' '.join(dict(sorted(tokens.items())).values())

    return string
