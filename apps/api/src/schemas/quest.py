from pydantic import BaseModel, Field
from typing import List, Optional

class QuestObjective(BaseModel):
    id: str
    description: str
    target_count: int
    current_count: int = 0
    completed: bool = False

class QuestGenerateRequest(BaseModel):
    player_id: str
    elo_rating: int = 1000
    level: int = 1
    playtime_h: float = 0.0
    recent_kills: int = 0
    map_id: str = "nexus-city-v1"
    npc_id: str = "oracle_ai"
    style: str = "cyberpunk"

class QuestResponse(BaseModel):
    quest_id: str
    title: str
    description: str
    objectives: List[QuestObjective]
    reward_xp: int
    reward_coins: int
