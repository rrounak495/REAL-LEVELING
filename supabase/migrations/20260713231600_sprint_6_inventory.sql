-- Sprint 6 - Inventory, Equipment & Shop System

-- 1. Inventory Items (Base table for all cosmetics/items)
CREATE TABLE public.inventory_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    lore text NOT NULL DEFAULT '',
    category text NOT NULL, -- 'Helmet', 'Hair', 'Face', 'Armor', 'Weapon', 'Gloves', 'Boots', 'Ring', 'Aura', 'Background', 'ProfileFrame', 'Title', 'Animation'
    rarity text NOT NULL, -- 'Common', 'Rare', 'Epic', 'Legendary'
    unlock_method text NOT NULL, -- 'Level', 'Achievement', 'ShopPurchase', 'Event', 'Season', 'BossReward'
    required_level integer DEFAULT 1 NOT NULL,
    required_rank text,
    coin_price integer DEFAULT 0 NOT NULL,
    gem_price integer DEFAULT 0 NOT NULL,
    image_path text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inventory items are viewable by everyone."
    ON public.inventory_items FOR SELECT
    USING (true);

-- 2. Shop Items (Optional extension if we need shop specific data like rotation, but for now we can just use inventory_items and filter by unlock_method = 'ShopPurchase' or join)
CREATE TABLE public.shop_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    is_featured boolean DEFAULT false NOT NULL,
    is_coming_soon boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shop items are viewable by everyone."
    ON public.shop_items FOR SELECT
    USING (true);

-- 3. User Inventory (Owned items)
CREATE TABLE public.user_inventory (
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    acquired_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, item_id)
);

ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own inventory."
    ON public.user_inventory FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own inventory."
    ON public.user_inventory FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update their own inventory."
    ON public.user_inventory FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own inventory."
    ON public.user_inventory FOR DELETE
    USING (auth.uid() = user_id);

-- 4. Alter avatar_configs to support new equipment slots
-- Previously had: helmet_id, armor_id, weapon_id, gloves_id, boots_id, ring_id, title_id, frame_id, background_id, animation_id
ALTER TABLE public.avatar_configs 
ADD COLUMN IF NOT EXISTS hair_id uuid REFERENCES public.inventory_items(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS face_id uuid REFERENCES public.inventory_items(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS aura_id uuid REFERENCES public.inventory_items(id) ON DELETE SET NULL;

-- 5. Purchase History
CREATE TABLE public.purchase_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    currency_used text NOT NULL, -- 'Coin' or 'Gem'
    amount_paid integer NOT NULL,
    purchased_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.purchase_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchase history."
    ON public.purchase_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchase history."
    ON public.purchase_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Explicit GRANTS
GRANT ALL ON TABLE public.inventory_items TO authenticated;
GRANT ALL ON TABLE public.shop_items TO authenticated;
GRANT ALL ON TABLE public.user_inventory TO authenticated;
GRANT ALL ON TABLE public.purchase_history TO authenticated;
