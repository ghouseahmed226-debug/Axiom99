# [Agent-45: XGBoost Matchmaking Modeler]
from fastapi import APIRouter, HTTPException
from ..schemas.matchmaking import MatchmakingRequest, MatchmakingResponse
from ..ml.matchmaking.model import matchmaking_model

router = APIRouter()

@router.post("/cluster", response_model=MatchmakingResponse)
async def cluster_players(req: MatchmakingRequest):
    try:
        lobbies = matchmaking_model.cluster_lobbies(req.players, lobby_size=req.lobby_size)
        return MatchmakingResponse(lobbies=lobbies, total_lobbies=len(lobbies))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-elo")
async def predict_single_elo(features: dict):
    try:
        elo = matchmaking_model.predict_elo(features)
        return {"predicted_elo": elo}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
