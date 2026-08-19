# [Agent-65: Toxicity Filter & Game AI]
from fastapi import APIRouter
from pydantic import BaseModel

class ToxicityCheckRequest(BaseModel):
    message: str
    player_id: str

router = APIRouter()

PROFANITY_LIST = {"hack", "cheat", "aimbot", "exploit", "toxic"}

@router.post("/check")
async def check_toxicity(req: ToxicityCheckRequest):
    text_lower = req.message.lower()
    flagged = any(word in text_lower for word in PROFANITY_LIST)
    score = 0.85 if flagged else 0.02
    return {
        "flagged": flagged,
        "score": score,
        "clean_message": "***" if flagged else req.message,
        "action": "warn" if flagged else "allow"
    }
