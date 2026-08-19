# [Agent-49: Anti-Cheat Anomaly Detector]
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List

HARD_LIMITS: dict[str, tuple[str, float]] = {
    'velocity_magnitude': ('gt', 30.0),   # >30 m/s = speed hack
    'heading_delta':      ('gt', 0.8),    # >0.8 rad/tick = spinbot/aimbot
    'hs_ratio_session':   ('gt', 0.97),   # >97% HS = trigger bot
    'reaction_ms':        ('lt', 60.0),   # <60 ms = inhumanly fast
}

@dataclass
class TelemetryFrame:
    uid:                  str
    tick:                 int
    x:                    float
    y:                    float
    z:                    float
    velocity_magnitude:   float
    heading_delta:        float
    hs_ratio_session:     float
    reaction_ms:          float
    extra:                dict = field(default_factory=dict)

@dataclass
class SuspicionResult:
    uid:        str
    tick:       int
    flags:      list[str]
    suspicious: bool
    iso_score:  float = 0.0

class AntiCheatDetector:
    """Stateless per-frame rule engine with optional Isolation Forest."""

    def __init__(self) -> None:
        self._iso: Any = None
        self._iso_fitted = False

    def _hard_flags(self, f: TelemetryFrame) -> list[str]:
        flags: list[str] = []
        values = {
            'velocity_magnitude': f.velocity_magnitude,
            'heading_delta':      f.heading_delta,
            'hs_ratio_session':   f.hs_ratio_session,
            'reaction_ms':        f.reaction_ms,
        }
        for key, (op, limit) in HARD_LIMITS.items():
            v = values.get(key, 0.0)
            if op == 'gt' and v > limit:
                flags.append(key.upper() + '_EXCEEDED')
            elif op == 'lt' and v < limit:
                flags.append(key.upper() + '_SUBHUMAN')
        return flags

    def score_frame(self, f: TelemetryFrame) -> SuspicionResult:
        flags = self._hard_flags(f)
        return SuspicionResult(
            uid=f.uid,
            tick=f.tick,
            flags=flags,
            suspicious=len(flags) > 0,
            iso_score=0.0
        )

detector = AntiCheatDetector()