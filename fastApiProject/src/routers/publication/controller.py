from fastapi import HTTPException


async def controller_get_publications(page: int, limit: int):
    return {"asd:": limit}


async def controller_get_publication_types():
    return {'asd': 'asd'}


async def controller_get_publication_by_id(id: int):
    return {"asd": id}


async def controller_get_publication_authors_by_id(id: int):
    return {"asd": id}
