from pydantic import BaseModel, Field
from typing import List, Dict, Any

class MatchmakingRequest(BaseModel):
    players: List[Dict[str, Any]] = Field(..., description="List of player profiles with telemetry features")
    lobby_size: int = Field(default=20, ge=2, le=100)

class MatchmakingResponse(BaseModel):
    lobbies: List[List[str]] = Field(..., description="Clusters of player UIDs matched by ELO rating")
    total_lobbies: int