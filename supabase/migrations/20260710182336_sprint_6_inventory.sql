-- Sprint 6: Inventory & Shop System
-- Extends the Avatar Evolution system to support shop purchases and multiple unlock methods.

-- 1. Modify `avatar_unlocks` to be a generalized cosmetic items table.
ALTER TABLE public.avatar_unlocks ALTER COLUMN required_level DROP NOT NULL;
ALTER TABLE public.avatar_unlocks ADD COLUMN unlock_method text DEFAULT 'level'; -- 'level', 'shop', 'event'
ALTER TABLE public.avatar_unlocks ADD COLUMN price_coins integer DEFAULT 0;
ALTER TABLE public.avatar_unlocks ADD COLUMN price_gems integer DEFAULT 0;
ALTER TABLE public.avatar_unlocks ADD COLUMN rarity text DEFAULT 'common'; -- 'common', 'rare', 'epic', 'legendary', 'mythic'

-- 2. Modify `avatar_configs` to support new equipment slots
ALTER TABLE public.avatar_configs ADD COLUMN helmet_id uuid REFERENCES public.avatar_unlocks(id);
ALTER TABLE public.avatar_configs ADD COLUMN armor_id uuid REFERENCES public.avatar_unlocks(id);
ALTER TABLE public.avatar_configs ADD COLUMN weapon_id uuid REFERENCES public.avatar_unlocks(id);
ALTER TABLE public.avatar_configs ADD COLUMN gloves_id uuid REFERENCES public.avatar_unlocks(id);
ALTER TABLE public.avatar_configs ADD COLUMN boots_id uuid REFERENCES public.avatar_unlocks(id);
ALTER TABLE public.avatar_configs ADD COLUMN ring_id uuid REFERENCES public.avatar_unlocks(id);
ALTER TABLE public.avatar_configs ADD COLUMN title_id uuid REFERENCES public.avatar_unlocks(id);
ALTER TABLE public.avatar_configs ADD COLUMN frame_id uuid REFERENCES public.avatar_unlocks(id);
ALTER TABLE public.avatar_configs ADD COLUMN background_id uuid REFERENCES public.avatar_unlocks(id);
ALTER TABLE public.avatar_configs ADD COLUMN animation_id uuid REFERENCES public.avatar_unlocks(id);

-- 3. Seed Shop Items
INSERT INTO public.avatar_unlocks (unlock_method, category, name, description, rarity, price_coins, price_gems) VALUES
('shop', 'Weapon', 'Knight''s Longsword', 'A sturdy blade for beginners.', 'common', 500, 0),
('shop', 'Weapon', 'Shadow Dagger', 'A swift and deadly weapon.', 'rare', 1500, 10),
('shop', 'Weapon', 'Demon King''s Greatsword', 'Radiates immense dark energy.', 'legendary', 0, 500),
('shop', 'Helmet', 'Iron Helm', 'Standard protection.', 'common', 300, 0),
('shop', 'Helmet', 'Crown of Shadows', 'For those who walk in darkness.', 'epic', 5000, 50),
('shop', 'Armor', 'Leather Vest', 'Lightweight and flexible.', 'common', 400, 0),
('shop', 'Armor', 'Monarch''s Plate', 'Impenetrable armor forged from darkness.', 'mythic', 0, 1000),
('shop', 'Aura', 'Flickering Shadow', 'A faint shadowy presence.', 'rare', 2000, 20),
('shop', 'Aura', 'Monarch''s Domain', 'A terrifying aura that suppresses all.', 'mythic', 0, 800),
('shop', 'Title', 'The Awakened', 'You have opened your eyes.', 'common', 100, 0),
('shop', 'Title', 'Shadow Sovereign', 'Ruler of the dead.', 'mythic', 0, 2000),
('shop', 'Profile Frame', 'Bronze Frame', 'A simple bronze frame.', 'common', 200, 0),
('shop', 'Profile Frame', 'Neon Purple Glow', 'A pulsing purple border.', 'epic', 3000, 30);
