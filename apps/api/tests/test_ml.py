# [Agent-45] ML Model Unit Tests
import pytest
from apps.api.src.ml.matchmaking.model import MatchmakingModel
from apps.api.src.ml.anticheat.detector import AntiCheatDetector, TelemetryFrame

def test_matchmaking_clustering():
    model = MatchmakingModel()
    players = [
        {"uid": f"p_{i}", "features": {"kd_ratio": 1.0 + i*0.1, "win_rate_7d": 0.5}}
        for i in range(10)
    ]
    lobbies = model.cluster_lobbies(players, lobby_size=5)
    assert len(lobbies) >= 1

def test_anticheat_detector_instance():
    detector = AntiCheatDetector()
    frame = TelemetryFrame(
        uid="u1", tick=1, x=0, y=0, z=0,
        velocity_magnitude=5.0, heading_delta=0.01,
        hs_ratio_session=0.2, reaction_ms=120.0
    )
    result = detector.score_frame(frame)
    assert result.suspicious is False