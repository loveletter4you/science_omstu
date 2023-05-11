# from fastapi import HTTPException, status
# from sqlalchemy.orm import Session
#
# from src.routers.publication.service import service_get_publications, \
#     service_get_publications_search, service_get_publication
#
#
# async def controller_get_publications(search: str, page: int, limit: int, accepted: bool, db: Session):
#     offset = page * limit
#     if search is None:
#         publications = await service_get_publications(offset, limit, accepted, db)
#         return publications
#     else:
#         publications = await service_get_publications_search(search, offset, limit, accepted, db)
#         return publications