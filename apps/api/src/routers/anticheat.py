# [Agent-49: Anti-Cheat Anomaly Detector]
from fastapi import APIRouter
from ..schemas.telemetry import TelemetryFrame as TelemetrySchema
from ..ml.anticheat.detector import detector, TelemetryFrame

router = APIRouter()

@router.post("/verify")
async def verify_telemetry(frame: TelemetrySchema):
    domain_frame = TelemetryFrame(
        uid=frame.uid,
        tick=frame.tick,
        x=frame.x,
        y=frame.y,
        z=frame.z,
        velocity_magnitude=frame.velocity_magnitude,
        heading_delta=frame.heading_delta,
        hs_ratio_session=frame.hs_ratio_session,
        reaction_ms=frame.reaction_ms,
        extra=frame.extra or {}
    )
    result = detector.score_frame(domain_frame)
    return {
        "uid": result.uid,
        "tick": result.tick,
        "flags": result.flags,
        "suspicious": result.suspicious,
        "iso_score": result.iso_score
    }
