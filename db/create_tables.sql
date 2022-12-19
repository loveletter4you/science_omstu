create table if not exists roles
(
    id   serial primary key,
    name varchar(32) unique
);

create table if not exists users
(
    id       serial primary key,
    email    varchar(256) not null,
    login    varchar(256) not null,
    password varchar(256) not null,
    role_id  integer      not null references roles
);

create table if not exists interests
(
    id       serial primary key,
    interest varchar(64) not null unique
);

create table if not exists authors
(
    id         serial primary key,
    name       varchar(32) not null,
    surname    varchar(32) not null,
    patronymic varchar(32),
    user_id    integer references users
);

create table author_interest
(
    id bigserial primary key,
    interest_id  integer not null references interests,
    author_id    integer not null references authors,
    unique(interest_id, author_id)
);

create table if not exists identifiers
(
    id   serial primary key,
    name varchar(32) not null unique
);

create table if not exists author_identifier
(
    id            bigserial primary key,
    author_id     integer      not null references authors,
    identifier_id integer      not null references identifiers,
    identifier    varchar(256) not null,
    unique (author_id, identifier_id)
);
create table if not exists source_type
(
    id serial primary key,
    name varchar(64) not null unique
);

create table if not exists sources_link_type
(
    id serial primary key,
    name varchar(64) not null unique
);

create table if not exists sources_rating_type
(
    id   serial primary key,
    name varchar(64) not null unique
);

create table if not exists sources
(
    id             serial primary key,
    source_type_id integer     not null references source_type,
    name           varchar(256) not null
);

create table if not exists source_link
(
    id                  bigserial primary key,
    source_id           integer       not null references sources,
    source_link_type_id integer       not null references sources_link_type,
    link                varchar(2048) not null
);

create table if not exists source_rating
(
    id                    bigserial primary key,
    source_id             integer     not null references sources,
    source_rating_type_id integer     not null references sources_rating_type,
    rating                varchar(32) not null,
    rating_date           date        not null,
    unique (source_id, source_rating_type_id, rating_date)
);

create table if not exists publication_types
(
    id   serial primary key,
    name varchar(32) not null unique
);

create table if not exists publications
(
    id               serial primary key,
    type_id          integer not null references publication_types,
    source_id        integer not null references sources,
    title            text    not null,
    abstract         text,
    publication_date date    not null

);

create table if not exists keywords
(
    id      serial primary key,
    keyword varchar(128) not null unique
);

create table if not exists keywords_publication
(
    id             bigserial primary key,
    publication_id integer not null references publications,
    keyword_id     integer not null references keywords,
    unique (publication_id, keyword_id)
);

create table if not exists organizations
(
    id      serial primary key,
    name    varchar(256) not null,
    country varchar(64),
    city    varchar(64)
);

create table if not exists author_publication
(
    id             bigserial primary key,
    author_id      integer not null references authors,
    publication_id integer not null references publications
);

create table if not exists author_publication_organization
(
    id                    bigserial primary key,
    author_publication_id integer not null references author_publication,
    organization_id       integer not null references organizations,
    unique (author_publication_id, organization_id)
);

create table if not exists publication_links_type
(
    id   serial primary key,
    name varchar(64) not null unique
);

create table if not exists publication_link
(
    id             bigserial primary key,
    publication_id integer       not null references publications,
    link_type_id   integer       not null references publication_links_type,
    link           varchar(2048) not null unique,
    unique (publication_id, link_type_id)
)
