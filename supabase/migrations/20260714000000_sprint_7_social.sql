-- Sprint 7: Social Layer Foundation Migration
-- Includes Follows, Friendships, Feed Posts, Reactions, Comments, Notifications, and Storage Policies

-- 1. Create Storage Bucket for Feed Images
INSERT INTO storage.buckets (id, name, public) VALUES ('feed_images', 'feed_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for feed_images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'feed_images' );
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'feed_images' AND (storage.foldername(name))[1] = auth.uid()::text );
CREATE POLICY "Users can update their own objects" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'feed_images' AND auth.uid() = owner ) WITH CHECK ( bucket_id = 'feed_images' AND auth.uid() = owner );
CREATE POLICY "Users can delete their own objects" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'feed_images' AND auth.uid() = owner );

-- 2. Follows Table (One-way relationship)
CREATE TABLE public.follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(follower_id, following_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see all follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE USING (auth.uid() = follower_id);


-- 3. Friendships Table (Two-way relationship via status)
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'blocked');

CREATE TABLE public.friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status friendship_status DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, friend_id)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own friendships" ON public.friendships FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can create friend requests" ON public.friendships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their received requests" ON public.friendships FOR UPDATE USING (auth.uid() = friend_id OR auth.uid() = user_id) WITH CHECK (auth.uid() = friend_id OR auth.uid() = user_id);
CREATE POLICY "Users can delete friendships" ON public.friendships FOR DELETE USING (auth.uid() = user_id OR auth.uid() = friend_id);


-- 4. Feed Posts
CREATE TYPE post_type AS ENUM ('standard_post', 'level_up', 'workout', 'boss', 'achievement');

CREATE TABLE public.feed_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type post_type DEFAULT 'standard_post' NOT NULL,
    content TEXT,
    image_url TEXT,
    tag TEXT, -- E.g. 'Workout Complete'
    xp_earned INTEGER,
    likes_count INTEGER DEFAULT 0 NOT NULL,
    comments_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are public" ON public.feed_posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON public.feed_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.feed_posts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.feed_posts FOR DELETE USING (auth.uid() = user_id);


-- 5. Post Reactions (Likes)
CREATE TYPE reaction_type AS ENUM ('fire', 'power', 'respect', 'lightning', 'heart');

CREATE TABLE public.post_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction reaction_type DEFAULT 'fire' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(post_id, user_id, reaction)
);

ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reactions are public" ON public.post_reactions FOR SELECT USING (true);
CREATE POLICY "Users can react" ON public.post_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their reactions" ON public.post_reactions FOR DELETE USING (auth.uid() = user_id);

-- Trigger to update likes_count on feed_posts
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.feed_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.feed_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_likes_count_trigger
AFTER INSERT OR DELETE ON public.post_reactions
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();


-- 6. Post Comments
CREATE TABLE public.post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE, -- For replies
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are public" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Users can comment" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their comments" ON public.post_comments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their comments" ON public.post_comments FOR DELETE USING (auth.uid() = user_id);

-- Trigger to update comments_count on feed_posts
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.feed_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.feed_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comments_count_trigger
AFTER INSERT OR DELETE ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();


-- 7. Notifications
CREATE TYPE notification_type AS ENUM ('friend_request', 'friend_accepted', 'new_follower', 'post_like', 'post_comment', 'comment_reply');

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Recipient
    actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Sender/Actor
    type notification_type NOT NULL,
    reference_id UUID, -- ID of the post, comment, or friendship
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = actor_id);
CREATE POLICY "Users can update their notifications (mark read)" ON public.notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);


-- 8. Leaderboard View Extension (Updating profiles to track social stats efficiently if needed)
-- We will dynamically fetch followers_count, following_count, friends_count using COUNT() in the RPC/API or add them here as columns.
-- For a highly scalable system, counts are usually aggregated or triggered, but since we are early, we will compute them dynamically.
