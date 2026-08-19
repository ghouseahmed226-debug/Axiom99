# [Agent-45 & Agent-49] API integration unit tests
import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_anticheat_clean_frame():
    frame = {
        "uid": "usr_test_1",
        "session_id": "session_1",
        "tick": 100,
        "x": 10.0,
        "y": 0.0,
        "z": 10.0,
        "velocity_magnitude": 5.0,
        "heading_delta": 0.05,
        "hs_ratio_session": 0.25,
        "reaction_ms": 180.0
    }
    response = client.post("/v1/anticheat/verify", json=frame)
    assert response.status_code == 200
    data = response.json()
    assert data["suspicious"] is False
    assert len(data["flags"]) == 0

def test_anticheat_speedhack_flag():
    frame = {
        "uid": "usr_hacker",
        "session_id": "session_1",
        "tick": 101,
        "x": 100.0,
        "y": 0.0,
        "z": 100.0,
        "velocity_magnitude": 65.0, # Exceeds 30.0 limit
        "heading_delta": 0.05,
        "hs_ratio_session": 0.25,
        "reaction_ms": 180.0
    }
    response = client.post("/v1/anticheat/verify", json=frame)
    assert response.status_code == 200
    data = response.json()
    assert data["suspicious"] is True
    assert "VELOCITY_MAGNITUDE_EXCEEDED" in data["flags"]

def test_quest_generation():
    req = {
        "player_id": "usr_test_1",
        "level": 12,
        "map_id": "nexus-core"
    }
    response = client.post("/v1/quest/generate", json=req)
    assert response.status_code == 200
    data = response.json()
    assert "Operation Cyberflare" in data["title"]
    assert len(data["objectives"]) == 2
    assert data["reward_xp"] > 0

def test_toxicity_filter():
    req = {"message": "Great match GG WP!", "player_id": "usr_1"}
    response = client.post("/v1/toxicity/check", json=req)
    assert response.status_code == 200
    assert response.json()["flagged"] is False

    req_toxic = {"message": "You are using aimbot exploit", "player_id": "usr_2"}
    response_toxic = client.post("/v1/toxicity/check", json=req_toxic)
    assert response_toxic.status_code == 200
    assert response_toxic.json()["flagged"] is True
