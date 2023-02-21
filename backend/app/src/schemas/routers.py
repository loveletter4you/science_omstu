from typing import List

from pydantic import BaseModel

from src.schemas.schemas import SchemePublication


class SchemePublicationsRouter(BaseModel):
    publications: List[SchemePublication]
    count: int


