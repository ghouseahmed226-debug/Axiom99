from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class TelemetryFrame(BaseModel):
    uid: str = Field(..., description="Unique player identifier")
    session_id: str = Field(..., description="Active session ID")
    tick: int = Field(..., ge=0, description="Monotonic game simulation tick")
    event_type: str = Field(default="move", description="Event category: move, weapon_fire, kill, death")
    x: float
    y: float
    z: float
    velocity_magnitude: float = Field(0.0, description="Player speed in m/s")
    heading_delta: float = Field(0.0, description="Angular change in radians per tick")
    hs_ratio_session: float = Field(0.0, ge=0.0, le=1.0, description="Session headshot ratio")
    reaction_ms: float = Field(150.0, description="Reaction time in milliseconds")
    extra: Optional[Dict[str, Any]] = Field(default_factory=dict)
