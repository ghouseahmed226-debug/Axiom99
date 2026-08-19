# [Agent-45: XGBoost Matchmaking Modeler]
"""
Skill-Based Matchmaking via XGBoost ELO rating prediction.
Players are clustered into lobbies within +/-150 ELO bands.
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, List

log = logging.getLogger(__name__)

ARTIFACT_PATH = Path(__file__).parent.parent.parent.parent / 'artifacts' / 'matchmaking_v1.pkl'

FEATURE_COLS: list[str] = [
    'kd_ratio', 'avg_damage', 'win_rate_7d', 'placement_avg',
    'session_count_30d', 'playtime_hours', 'headshot_pct',
    'objective_score', 'revive_rate', 'device_tier',
]

ELO_WINDOW = 150

class MatchmakingModel:
    """Predicts player ELO rating from telemetry features, clusters lobbies."""

    def __init__(self) -> None:
        self._pipe: Any = None

    def train(self, df: Any) -> dict[str, Any]:
        """Train and persist the model."""
        try:
            import joblib
            import xgboost as xgb
            from sklearn.pipeline import Pipeline
            from sklearn.preprocessing import StandardScaler

            pipe = Pipeline([
                ('scaler', StandardScaler()),
                ('xgb', xgb.XGBRegressor(
                    n_estimators=400,
                    max_depth=6,
                    learning_rate=0.05,
                    subsample=0.8,
                    colsample_bytree=0.8,
                    objective='reg:squarederror',
                    eval_metric='rmse',
                    n_jobs=-1,
                )),
            ])
            X = df[FEATURE_COLS].values
            y = df['elo_rating'].values
            pipe.fit(X, y)
            ARTIFACT_PATH.parent.mkdir(parents=True, exist_ok=True)
            joblib.dump(pipe, ARTIFACT_PATH)
            self._pipe = pipe
            return {'status': 'trained', 'n_samples': len(y)}
        except ImportError as e:
            log.warning("Training dependencies not available: %s", e)
            return {'status': 'skipped', 'reason': str(e)}

    def predict_elo(self, features: dict[str, float]) -> float:
        """Predict player ELO with ML model or fast heuristic fallback."""
        if self._pipe is not None:
            try:
                import numpy as np
                row = np.array([[features.get(c, 0.0) for c in FEATURE_COLS]])
                return float(self._pipe.predict(row)[0])
            except Exception:
                pass
        
        # Robust heuristic fallback (1000 base + KD*200 + WinRate*400)
        kd = features.get('kd_ratio', 1.0)
        win_rate = features.get('win_rate_7d', 0.5)
        damage = features.get('avg_damage', 300.0)
        return float(round(1000 + (kd - 1.0) * 250 + (win_rate - 0.5) * 500 + (damage / 10)))

    def cluster_lobbies(
        self,
        players: list[dict[str, Any]],
        lobby_size: int = 20,
    ) -> list[list[str]]:
        """
        Group players into balanced lobbies.
        Each player dict: {'uid': str, 'features': dict[str, float]}
        """
        rated = sorted(
            players,
            key=lambda p: self.predict_elo(p.get('features', {}))
        )
        lobbies: list[list[str]] = []
        current: list[dict[str, Any]] = []

        for p in rated:
            elo = self.predict_elo(p.get('features', {}))
            p['_elo'] = elo
            if current and abs(elo - current[0]['_elo']) > ELO_WINDOW:
                lobbies.append([x['uid'] for x in current])
                current = []
            current.append(p)
            if len(current) >= lobby_size:
                lobbies.append([x['uid'] for x in current])
                current = []

        if current:
            lobbies.append([x['uid'] for x in current])

        return lobbies

matchmaking_model = MatchmakingModel()