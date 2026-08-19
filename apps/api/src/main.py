# [Agent-54: Data Pipeline Engineer] + [Agent-77: Rate-Limiter]
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from .routers import matchmaking, anticheat, quest, telemetry, toxicity

limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

app = FastAPI(title="NexusWeb AI API", version="0.1.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://nexusweb.gg", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(matchmaking.router, prefix="/v1/matchmaking", tags=["Matchmaking"])
app.include_router(anticheat.router,   prefix="/v1/anticheat",   tags=["Anti-Cheat"])
app.include_router(quest.router,       prefix="/v1/quest",        tags=["Quest"])
app.include_router(telemetry.router,   prefix="/v1/telemetry",    tags=["Telemetry"])
app.include_router(toxicity.router,    prefix="/v1/toxicity",     tags=["Toxicity"])

@app.get('/health')
async def health() -> dict:
    return {'status': 'ok', 'service': 'nexusweb-api'}
