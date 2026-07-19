-- Sprint 3B: Avatar Configuration Table
-- Stores the user's avatar config as structured JSON-friendly columns.
-- Designed for future avatar evolution (Level 1 → 100 milestone unlocks).
-- Sprint 3B+: When evolution milestones are implemented, add a `stage` column
-- referencing the player's current level band.

-- avatar_configs: one row per user, all fields nullable (except id).
-- A NULL field means the user accepted the default for that slot.
CREATE TABLE public.avatar_configs (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Base model determines the skeleton/silhouette (male/female/nonbinary archetypes)
  base_model  TEXT NOT NULL DEFAULT 'default_male',
  -- Layer slots — NULL means "use system default for base_model"
  hair_id     TEXT,
  hair_color  TEXT,
  eyes_id     TEXT,
  eye_color   TEXT,
  outfit_id   TEXT,
  aura_id     TEXT,
  accessory_id TEXT,
  -- Timestamps
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index: auth layer will filter by id; primary key covers this.
-- RLS
ALTER TABLE public.avatar_configs ENABLE ROW LEVEL SECURITY;

-- Intent: Avatar configs are public player cards — viewable by everyone for profile display.
CREATE POLICY "Avatar configs are viewable by everyone."
  ON public.avatar_configs FOR SELECT USING (true);

-- Intent: Users can only create their own avatar config row.
CREATE POLICY "Users can insert own avatar config."
  ON public.avatar_configs FOR INSERT WITH CHECK (auth.uid() = id);

-- Intent: Users can only update their own avatar config.
CREATE POLICY "Users can update own avatar config."
  ON public.avatar_configs FOR UPDATE USING (auth.uid() = id);

-- Auto-update updated_at on every update
CREATE TRIGGER trigger_avatar_configs_updated_at
  BEFORE UPDATE ON public.avatar_configs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
