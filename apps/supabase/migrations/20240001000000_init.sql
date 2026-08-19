-- ============================================================
-- NexusWeb -- Supabase Schema v1
-- [Agent-34: PostgreSQL Schema Designer]
-- [Agent-38: Row-Level Security Enforcer]
-- [Agent-42: Supabase Auth Specialist]
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Enums
CREATE TYPE player_status AS ENUM ('active','banned','suspended','guest');
CREATE TYPE item_rarity   AS ENUM ('common','uncommon','rare','epic','legendary');
CREATE TYPE match_result  AS ENUM ('win','loss','draw','abandoned');

-- ── profiles ─────────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT NOT NULL UNIQUE
                  CHECK (length(username) BETWEEN 3 AND 24
                    AND username ~ '^[a-zA-Z0-9_]+$'),
  display_name  TEXT NOT NULL DEFAULT '',
  avatar_url    TEXT,
  bio           TEXT CHECK (length(bio) <= 300),
  status        player_status NOT NULL DEFAULT 'active',
  elo_rating    INTEGER NOT NULL DEFAULT 1000 CHECK (elo_rating BETWEEN 0 AND 9999),
  level         SMALLINT NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 100),
  total_xp      BIGINT NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  country_code  CHAR(2),
  device_tier   SMALLINT NOT NULL DEFAULT 1 CHECK (device_tier IN (0,1,2,3)),
  preferences   JSONB NOT NULL DEFAULT '{}',
  last_seen_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_profiles_elo      ON public.profiles (elo_rating DESC);
CREATE INDEX idx_profiles_username ON public.profiles USING gin (username gin_trgm_ops);

-- ── wallets ──────────────────────────────────────────────────────────────────
CREATE TABLE public.wallets (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id   UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  coins       BIGINT NOT NULL DEFAULT 0 CHECK (coins   >= 0),
  gems        BIGINT NOT NULL DEFAULT 0 CHECK (gems    >= 0),
  tickets     INTEGER NOT NULL DEFAULT 0 CHECK (tickets >= 0),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── items ────────────────────────────────────────────────────────────────────
CREATE TABLE public.items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  description  TEXT,
  rarity       item_rarity NOT NULL DEFAULT 'common',
  item_type    TEXT NOT NULL,
  asset_url    TEXT NOT NULL,
  price_coins  INTEGER NOT NULL DEFAULT 0 CHECK (price_coins >= 0),
  price_gems   INTEGER NOT NULL DEFAULT 0 CHECK (price_gems  >= 0),
  is_tradable  BOOLEAN NOT NULL DEFAULT TRUE,
  metadata     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_items_rarity ON public.items (rarity);
CREATE INDEX idx_items_type   ON public.items (item_type);

-- ── inventories ──────────────────────────────────────────────────────────────
CREATE TABLE public.inventories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id     UUID NOT NULL REFERENCES public.items(id),
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(player_id, item_id)
);
CREATE INDEX idx_inventories_player ON public.inventories (player_id);

-- ── matches ──────────────────────────────────────────────────────────────────
CREATE TABLE public.matches (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id   TEXT NOT NULL UNIQUE,
  game_mode    TEXT NOT NULL DEFAULT 'battle-royale',
  map_id       TEXT NOT NULL,
  region       TEXT NOT NULL DEFAULT 'us-east',
  player_count SMALLINT NOT NULL DEFAULT 0,
  started_at   TIMESTAMPTZ,
  ended_at     TIMESTAMPTZ,
  duration_s   INTEGER,
  metadata     JSONB NOT NULL DEFAULT '{}'
);
CREATE INDEX idx_matches_started   ON public.matches (started_at DESC);
CREATE INDEX idx_matches_game_mode ON public.matches (game_mode);

-- ── match_players ─────────────────────────────────────────────────────────────
CREATE TABLE public.match_players (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id      UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id     UUID NOT NULL REFERENCES public.profiles(id),
  result        match_result NOT NULL,
  placement     SMALLINT NOT NULL DEFAULT 1,
  kills         SMALLINT NOT NULL DEFAULT 0 CHECK (kills        >= 0),
  deaths        SMALLINT NOT NULL DEFAULT 0 CHECK (deaths       >= 0),
  assists       SMALLINT NOT NULL DEFAULT 0 CHECK (assists      >= 0),
  damage_dealt  INTEGER NOT NULL DEFAULT 0  CHECK (damage_dealt >= 0),
  damage_taken  INTEGER NOT NULL DEFAULT 0  CHECK (damage_taken >= 0),
  headshots     SMALLINT NOT NULL DEFAULT 0,
  xp_earned     INTEGER NOT NULL DEFAULT 0  CHECK (xp_earned    >= 0),
  elo_delta     SMALLINT NOT NULL DEFAULT 0,
  telemetry     JSONB NOT NULL DEFAULT '{}',
  UNIQUE(match_id, player_id)
);
CREATE INDEX idx_mp_player ON public.match_players (player_id, match_id DESC);
CREATE INDEX idx_mp_match  ON public.match_players (match_id);

-- ── leaderboard (materialized) ────────────────────────────────────────────────
CREATE MATERIALIZED VIEW public.leaderboard_global AS
  SELECT
    p.id, p.username, p.avatar_url, p.elo_rating, p.level,
    COUNT(mp.id)    AS matches_played,
    SUM(CASE WHEN mp.result = 'win' THEN 1 ELSE 0 END) AS wins,
    ROUND(SUM(mp.kills)::numeric / NULLIF(SUM(mp.deaths), 0), 2) AS kd_ratio,
    RANK() OVER (ORDER BY p.elo_rating DESC) AS rank
  FROM public.profiles p
  LEFT JOIN public.match_players mp ON mp.player_id = p.id
  WHERE p.status = 'active'
  GROUP BY p.id
WITH DATA;
CREATE UNIQUE INDEX ON public.leaderboard_global (id);
CREATE        INDEX idx_lb_rank ON public.leaderboard_global (rank);

-- ── llm_memory (pgvector) ────────────────────────────────────────────────────
CREATE TABLE public.llm_memory (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  context_type TEXT NOT NULL,
  content      TEXT NOT NULL,
  embedding    vector(1536),
  metadata     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_llm_player  ON public.llm_memory (player_id);
CREATE INDEX idx_llm_ivfflat ON public.llm_memory
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ── quests ───────────────────────────────────────────────────────────────────
CREATE TABLE public.quests (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  objectives   JSONB NOT NULL DEFAULT '[]',
  reward_xp    INTEGER NOT NULL DEFAULT 0,
  reward_items JSONB NOT NULL DEFAULT '[]',
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  generated_by TEXT NOT NULL DEFAULT 'llm',
  llm_prompt   TEXT,
  expires_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_quests_player ON public.quests (player_id, is_completed);

-- ── toxicity_events ──────────────────────────────────────────────────────────
CREATE TABLE public.toxicity_events (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id  UUID REFERENCES public.profiles(id),
  target_id    UUID REFERENCES public.profiles(id),
  match_id     UUID REFERENCES public.matches(id),
  channel      TEXT NOT NULL DEFAULT 'text',
  raw_content  TEXT,
  score        NUMERIC(4,3) NOT NULL CHECK (score BETWEEN 0 AND 1),
  categories   JSONB NOT NULL DEFAULT '{}',
  action_taken TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row-Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_memory    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests        ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_write"   ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "wallets_owner"        ON public.wallets  FOR ALL    USING (auth.uid() = player_id);
CREATE POLICY "inventories_owner"    ON public.inventories FOR ALL USING (auth.uid() = player_id);
CREATE POLICY "mp_read_own"          ON public.match_players FOR SELECT USING (auth.uid() = player_id);
CREATE POLICY "llm_memory_owner"     ON public.llm_memory  FOR ALL  USING (auth.uid() = player_id);
CREATE POLICY "quests_owner"         ON public.quests      FOR ALL  USING (auth.uid() = player_id);

-- ── Triggers ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER trg_wallets_updated  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Auto-create profile + wallet on auth.users INSERT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles(id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username',
             'player_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nexus Player')
  );
  INSERT INTO public.wallets(player_id) VALUES (NEW.id);
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
