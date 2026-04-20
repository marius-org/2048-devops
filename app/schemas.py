from pydantic import BaseModel
from datetime import datetime

class ScoreCreate(BaseModel):
    player_name: str
    score: int
    highest_tile: int

class ScoreResponse(BaseModel):
    id: int
    player_name: str
    score: int
    highest_tile: int
    created_at: datetime

    class Config:
        from_attributes = True