export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_id: string | null;
          coin_reward: number;
          created_at: string;
          description: string | null;
          gem_reward: number;
          id: string;
          name: string;
          requirement_type: string;
          requirement_value: number;
          xp_reward: number;
        };
        Insert: {
          badge_id?: string | null;
          coin_reward?: number;
          created_at?: string;
          description?: string | null;
          gem_reward?: number;
          id?: string;
          name: string;
          requirement_type: string;
          requirement_value: number;
          xp_reward?: number;
        };
        Update: {
          badge_id?: string | null;
          coin_reward?: number;
          created_at?: string;
          description?: string | null;
          gem_reward?: number;
          id?: string;
          name?: string;
          requirement_type?: string;
          requirement_value?: number;
          xp_reward?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'achievements_badge_id_fkey';
            columns: ['badge_id'];
            isOneToOne: false;
            referencedRelation: 'badges';
            referencedColumns: ['id'];
          },
        ];
      };
      avatar_configs: {
        Row: {
          accessory_id: string | null;
          animation_id: string | null;
          armor_id: string | null;
          aura_id: string | null;
          background_id: string | null;
          base_model: string;
          boots_id: string | null;
          created_at: string;
          eye_color: string | null;
          eyes_id: string | null;
          face_id: string | null;
          frame_id: string | null;
          gloves_id: string | null;
          hair_color: string | null;
          hair_id: string | null;
          helmet_id: string | null;
          id: string;
          outfit_id: string | null;
          ring_id: string | null;
          title_id: string | null;
          updated_at: string;
          weapon_id: string | null;
        };
        Insert: {
          accessory_id?: string | null;
          animation_id?: string | null;
          armor_id?: string | null;
          aura_id?: string | null;
          background_id?: string | null;
          base_model?: string;
          boots_id?: string | null;
          created_at?: string;
          eye_color?: string | null;
          eyes_id?: string | null;
          face_id?: string | null;
          frame_id?: string | null;
          gloves_id?: string | null;
          hair_color?: string | null;
          hair_id?: string | null;
          helmet_id?: string | null;
          id: string;
          outfit_id?: string | null;
          ring_id?: string | null;
          title_id?: string | null;
          updated_at?: string;
          weapon_id?: string | null;
        };
        Update: {
          accessory_id?: string | null;
          animation_id?: string | null;
          armor_id?: string | null;
          aura_id?: string | null;
          background_id?: string | null;
          base_model?: string;
          boots_id?: string | null;
          created_at?: string;
          eye_color?: string | null;
          eyes_id?: string | null;
          face_id?: string | null;
          frame_id?: string | null;
          gloves_id?: string | null;
          hair_color?: string | null;
          hair_id?: string | null;
          helmet_id?: string | null;
          id?: string;
          outfit_id?: string | null;
          ring_id?: string | null;
          title_id?: string | null;
          updated_at?: string;
          weapon_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'avatar_configs_animation_id_fkey';
            columns: ['animation_id'];
            isOneToOne: false;
            referencedRelation: 'avatar_unlocks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'avatar_configs_armor_id_fkey';
            columns: ['armor_id'];
            isOneToOne: false;
            referencedRelation: 'avatar_unlocks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'avatar_configs_background_id_fkey';
            columns: ['background_id'];
            isOneToOne: false;
            referencedRelation: 'avatar_unlocks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'avatar_configs_boots_id_fkey';
            columns: ['boots_id'];
            isOneToOne: false;
            referencedRelation: 'avatar_unlocks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'avatar_configs_face_id_fkey';
            columns: ['face_id'];
            isOneToOne: false;
            referencedRelation: 'inventory_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'avatar_configs_frame_id_fkey';
            columns: ['frame_id'];
            isOneToOne: false;
            referencedRelation: 'avatar_unlocks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'avatar_configs_gloves_id_fkey';
            columns: ['gloves_id'];
            isOneToOne: false;
            referencedRelation: 'avatar_unlocks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'avatar_configs_helmet_id_fkey';
            columns: ['helmet_id'];
            isOneToOne: false;
            referencedRelation: 'avatar_unlocks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'avatar_configs_ring_id_fkey';
            columns: ['ring_id'];
            isOneToOne: false;
            referencedRelation: 'avatar_unlocks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'avatar_configs_title_id_fkey';
            columns: ['title_id'];
            isOneToOne: false;
            referencedRelation: 'avatar_unlocks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'avatar_configs_weapon_id_fkey';
            columns: ['weapon_id'];
            isOneToOne: false;
            referencedRelation: 'avatar_unlocks';
            referencedColumns: ['id'];
          },
        ];
      };
      avatar_evolution_levels: {
        Row: {
          created_at: string;
          level: number;
          stage_name: string;
          theme_color: string;
        };
        Insert: {
          created_at?: string;
          level: number;
          stage_name: string;
          theme_color: string;
        };
        Update: {
          created_at?: string;
          level?: number;
          stage_name?: string;
          theme_color?: string;
        };
        Relationships: [];
      };
      avatar_unlocks: {
        Row: {
          category: string;
          created_at: string;
          description: string | null;
          id: string;
          metadata: Json | null;
          name: string;
          price_coins: number | null;
          price_gems: number | null;
          rarity: string | null;
          required_level: number | null;
          unlock_method: string | null;
        };
        Insert: {
          category: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          metadata?: Json | null;
          name: string;
          price_coins?: number | null;
          price_gems?: number | null;
          rarity?: string | null;
          required_level?: number | null;
          unlock_method?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          metadata?: Json | null;
          name?: string;
          price_coins?: number | null;
          price_gems?: number | null;
          rarity?: string | null;
          required_level?: number | null;
          unlock_method?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'avatar_unlocks_required_level_fkey';
            columns: ['required_level'];
            isOneToOne: false;
            referencedRelation: 'avatar_evolution_levels';
            referencedColumns: ['level'];
          },
        ];
      };
      badges: {
        Row: {
          animation_metadata: Json | null;
          created_at: string;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
          rarity: string;
        };
        Insert: {
          animation_metadata?: Json | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          rarity: string;
        };
        Update: {
          animation_metadata?: Json | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          rarity?: string;
        };
        Relationships: [];
      };
      boss_contributions: {
        Row: {
          activity_type: string;
          amount: number;
          boss_id: string;
          created_at: string;
          damage_dealt: number;
          id: string;
          idempotency_key: string;
          objective_id: string;
          status: string;
          user_id: string;
        };
        Insert: {
          activity_type: string;
          amount: number;
          boss_id: string;
          created_at?: string;
          damage_dealt: number;
          id?: string;
          idempotency_key: string;
          objective_id: string;
          status?: string;
          user_id: string;
        };
        Update: {
          activity_type?: string;
          amount?: number;
          boss_id?: string;
          created_at?: string;
          damage_dealt?: number;
          id?: string;
          idempotency_key?: string;
          objective_id?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'boss_contributions_boss_id_fkey';
            columns: ['boss_id'];
            isOneToOne: false;
            referencedRelation: 'bosses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'boss_contributions_objective_id_fkey';
            columns: ['objective_id'];
            isOneToOne: false;
            referencedRelation: 'boss_objectives';
            referencedColumns: ['id'];
          },
        ];
      };
      boss_objectives: {
        Row: {
          activity_type: string;
          base_damage: number;
          boss_id: string;
          created_at: string;
          id: string;
        };
        Insert: {
          activity_type: string;
          base_damage: number;
          boss_id: string;
          created_at?: string;
          id?: string;
        };
        Update: {
          activity_type?: string;
          base_damage?: number;
          boss_id?: string;
          created_at?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'boss_objectives_boss_id_fkey';
            columns: ['boss_id'];
            isOneToOne: false;
            referencedRelation: 'bosses';
            referencedColumns: ['id'];
          },
        ];
      };
      boss_participants: {
        Row: {
          boss_id: string;
          id: string;
          joined_at: string;
          total_damage: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          boss_id: string;
          id?: string;
          joined_at?: string;
          total_damage?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          boss_id?: string;
          id?: string;
          joined_at?: string;
          total_damage?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'boss_participants_boss_id_fkey';
            columns: ['boss_id'];
            isOneToOne: false;
            referencedRelation: 'bosses';
            referencedColumns: ['id'];
          },
        ];
      };
      boss_phases: {
        Row: {
          boss_id: string;
          created_at: string;
          damage_multiplier: number;
          hp_threshold_pct: number;
          id: string;
          message: string | null;
          phase_name: string;
          visual_state: string | null;
        };
        Insert: {
          boss_id: string;
          created_at?: string;
          damage_multiplier?: number;
          hp_threshold_pct: number;
          id?: string;
          message?: string | null;
          phase_name: string;
          visual_state?: string | null;
        };
        Update: {
          boss_id?: string;
          created_at?: string;
          damage_multiplier?: number;
          hp_threshold_pct?: number;
          id?: string;
          message?: string | null;
          phase_name?: string;
          visual_state?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'boss_phases_boss_id_fkey';
            columns: ['boss_id'];
            isOneToOne: false;
            referencedRelation: 'bosses';
            referencedColumns: ['id'];
          },
        ];
      };
      boss_reward_claims: {
        Row: {
          claimed_at: string;
          id: string;
          rule_id: string;
          user_id: string;
        };
        Insert: {
          claimed_at?: string;
          id?: string;
          rule_id: string;
          user_id: string;
        };
        Update: {
          claimed_at?: string;
          id?: string;
          rule_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'boss_reward_claims_rule_id_fkey';
            columns: ['rule_id'];
            isOneToOne: false;
            referencedRelation: 'boss_reward_rules';
            referencedColumns: ['id'];
          },
        ];
      };
      boss_reward_rules: {
        Row: {
          boss_id: string;
          condition_type: string;
          condition_value: string | null;
          created_at: string;
          id: string;
          quantity: number;
          reward_id: string | null;
          reward_type: string;
        };
        Insert: {
          boss_id: string;
          condition_type: string;
          condition_value?: string | null;
          created_at?: string;
          id?: string;
          quantity: number;
          reward_id?: string | null;
          reward_type: string;
        };
        Update: {
          boss_id?: string;
          condition_type?: string;
          condition_value?: string | null;
          created_at?: string;
          id?: string;
          quantity?: number;
          reward_id?: string | null;
          reward_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'boss_reward_rules_boss_id_fkey';
            columns: ['boss_id'];
            isOneToOne: false;
            referencedRelation: 'bosses';
            referencedColumns: ['id'];
          },
        ];
      };
      bosses: {
        Row: {
          artwork_url: string | null;
          boss_type: string;
          created_at: string;
          current_hp: number;
          difficulty: string;
          end_time: string;
          id: string;
          lore: string | null;
          min_level: number;
          name: string;
          rarity: string;
          recommended_level: number;
          start_time: string;
          status: string;
          title: string | null;
          total_hp: number;
          updated_at: string;
        };
        Insert: {
          artwork_url?: string | null;
          boss_type: string;
          created_at?: string;
          current_hp: number;
          difficulty: string;
          end_time: string;
          id?: string;
          lore?: string | null;
          min_level?: number;
          name: string;
          rarity: string;
          recommended_level?: number;
          start_time: string;
          status?: string;
          title?: string | null;
          total_hp: number;
          updated_at?: string;
        };
        Update: {
          artwork_url?: string | null;
          boss_type?: string;
          created_at?: string;
          current_hp?: number;
          difficulty?: string;
          end_time?: string;
          id?: string;
          lore?: string | null;
          min_level?: number;
          name?: string;
          rarity?: string;
          recommended_level?: number;
          start_time?: string;
          status?: string;
          title?: string | null;
          total_hp?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      feed_posts: {
        Row: {
          comments_count: number;
          content: string | null;
          created_at: string;
          id: string;
          image_url: string | null;
          likes_count: number;
          tag: string | null;
          type: Database['public']['Enums']['post_type'];
          updated_at: string;
          user_id: string;
          xp_earned: number | null;
        };
        Insert: {
          comments_count?: number;
          content?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          likes_count?: number;
          tag?: string | null;
          type?: Database['public']['Enums']['post_type'];
          updated_at?: string;
          user_id: string;
          xp_earned?: number | null;
        };
        Update: {
          comments_count?: number;
          content?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          likes_count?: number;
          tag?: string | null;
          type?: Database['public']['Enums']['post_type'];
          updated_at?: string;
          user_id?: string;
          xp_earned?: number | null;
        };
        Relationships: [];
      };
      first_use_guides: {
        Row: {
          completed_at: string;
          guide_id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          guide_id: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          guide_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      follows: {
        Row: {
          created_at: string;
          follower_id: string;
          following_id: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          follower_id: string;
          following_id: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          follower_id?: string;
          following_id?: string;
          id?: string;
        };
        Relationships: [];
      };
      friendships: {
        Row: {
          created_at: string;
          friend_id: string;
          id: string;
          status: Database['public']['Enums']['friendship_status'];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          friend_id: string;
          id?: string;
          status?: Database['public']['Enums']['friendship_status'];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          friend_id?: string;
          id?: string;
          status?: Database['public']['Enums']['friendship_status'];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      inventory_items: {
        Row: {
          category: string;
          coin_price: number;
          created_at: string;
          description: string;
          gem_price: number;
          id: string;
          image_path: string | null;
          lore: string;
          name: string;
          rarity: string;
          required_level: number;
          required_rank: string | null;
          unlock_method: string;
        };
        Insert: {
          category: string;
          coin_price?: number;
          created_at?: string;
          description: string;
          gem_price?: number;
          id?: string;
          image_path?: string | null;
          lore?: string;
          name: string;
          rarity: string;
          required_level?: number;
          required_rank?: string | null;
          unlock_method: string;
        };
        Update: {
          category?: string;
          coin_price?: number;
          created_at?: string;
          description?: string;
          gem_price?: number;
          id?: string;
          image_path?: string | null;
          lore?: string;
          name?: string;
          rarity?: string;
          required_level?: number;
          required_rank?: string | null;
          unlock_method?: string;
        };
        Relationships: [];
      };
      notification_preferences: {
        Row: {
          boss_ending: boolean | null;
          boss_enraged: boolean | null;
          daily_briefing: boolean | null;
          daily_chest: boolean | null;
          quiet_hours_end: string | null;
          quiet_hours_start: string | null;
          rival_updates: boolean | null;
          social_interactions: boolean | null;
          streak_risk: boolean | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          boss_ending?: boolean | null;
          boss_enraged?: boolean | null;
          daily_briefing?: boolean | null;
          daily_chest?: boolean | null;
          quiet_hours_end?: string | null;
          quiet_hours_start?: string | null;
          rival_updates?: boolean | null;
          social_interactions?: boolean | null;
          streak_risk?: boolean | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          boss_ending?: boolean | null;
          boss_enraged?: boolean | null;
          daily_briefing?: boolean | null;
          daily_chest?: boolean | null;
          quiet_hours_end?: string | null;
          quiet_hours_start?: string | null;
          rival_updates?: boolean | null;
          social_interactions?: boolean | null;
          streak_risk?: boolean | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          actor_id: string;
          created_at: string;
          id: string;
          is_read: boolean;
          reference_id: string | null;
          type: Database['public']['Enums']['notification_type'];
          user_id: string;
        };
        Insert: {
          actor_id: string;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          reference_id?: string | null;
          type: Database['public']['Enums']['notification_type'];
          user_id: string;
        };
        Update: {
          actor_id?: string;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          reference_id?: string | null;
          type?: Database['public']['Enums']['notification_type'];
          user_id?: string;
        };
        Relationships: [];
      };
      personal_records: {
        Row: {
          activity_type: string;
          created_at: string | null;
          id: string;
          metadata: Json | null;
          record_value: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          activity_type: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          record_value: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          activity_type?: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          record_value?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      post_comments: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          parent_id: string | null;
          post_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          parent_id?: string | null;
          post_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          parent_id?: string | null;
          post_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_comments_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'post_comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_comments_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'feed_posts';
            referencedColumns: ['id'];
          },
        ];
      };
      post_reactions: {
        Row: {
          created_at: string;
          id: string;
          post_id: string;
          reaction: Database['public']['Enums']['reaction_type'];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          post_id: string;
          reaction?: Database['public']['Enums']['reaction_type'];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          post_id?: string;
          reaction?: Database['public']['Enums']['reaction_type'];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_reactions_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'feed_posts';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          available_daily_time: number;
          avatar_url: string | null;
          bio: string | null;
          country: string | null;
          created_at: string;
          current_weight_kg: number | null;
          display_name: string | null;
          fitness_experience: string;
          fitness_goal: string;
          goal_weight_kg: number | null;
          id: string;
          onboarding_completed_at: string | null;
          timezone: string | null;
          training_location: string;
          onboarding_status: string | null;
          experience_level: string | null;
          primary_goal_category: string | null;
          premium_status: string | null;
          updated_at: string;
          username: string;
        };
        Insert: {
          available_daily_time?: number;
          avatar_url?: string | null;
          bio?: string | null;
          country?: string | null;
          created_at?: string;
          current_weight_kg?: number | null;
          display_name?: string | null;
          fitness_experience?: string;
          fitness_goal?: string;
          goal_weight_kg?: number | null;
          id: string;
          onboarding_completed_at?: string | null;
          timezone?: string | null;
          training_location?: string;
          onboarding_status?: string | null;
          experience_level?: string | null;
          primary_goal_category?: string | null;
          premium_status?: string | null;
          updated_at?: string;
          username: string;
        };
        Update: {
          available_daily_time?: number;
          avatar_url?: string | null;
          bio?: string | null;
          country?: string | null;
          created_at?: string;
          current_weight_kg?: number | null;
          display_name?: string | null;
          fitness_experience?: string;
          fitness_goal?: string;
          goal_weight_kg?: number | null;
          id?: string;
          onboarding_completed_at?: string | null;
          timezone?: string | null;
          training_location?: string;
          onboarding_status?: string | null;
          experience_level?: string | null;
          primary_goal_category?: string | null;
          premium_status?: string | null;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
      purchase_history: {
        Row: {
          amount_paid: number;
          currency_used: string;
          id: string;
          item_id: string;
          purchased_at: string;
          user_id: string;
        };
        Insert: {
          amount_paid: number;
          currency_used: string;
          id?: string;
          item_id: string;
          purchased_at?: string;
          user_id: string;
        };
        Update: {
          amount_paid?: number;
          currency_used?: string;
          id?: string;
          item_id?: string;
          purchased_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'purchase_history_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'inventory_items';
            referencedColumns: ['id'];
          },
        ];
      };
      rewards_history: {
        Row: {
          achievement_id: string | null;
          badge_id: string | null;
          coins: number;
          created_at: string;
          gems: number;
          id: string;
          reward_type: string;
          source: string;
          source_id: string | null;
          user_id: string;
          xp: number;
        };
        Insert: {
          achievement_id?: string | null;
          badge_id?: string | null;
          coins?: number;
          created_at?: string;
          gems?: number;
          id?: string;
          reward_type: string;
          source: string;
          source_id?: string | null;
          user_id: string;
          xp?: number;
        };
        Update: {
          achievement_id?: string | null;
          badge_id?: string | null;
          coins?: number;
          created_at?: string;
          gems?: number;
          id?: string;
          reward_type?: string;
          source?: string;
          source_id?: string | null;
          user_id?: string;
          xp?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'rewards_history_achievement_id_fkey';
            columns: ['achievement_id'];
            isOneToOne: false;
            referencedRelation: 'achievements';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rewards_history_badge_id_fkey';
            columns: ['badge_id'];
            isOneToOne: false;
            referencedRelation: 'badges';
            referencedColumns: ['id'];
          },
        ];
      };
      rivals: {
        Row: {
          created_at: string | null;
          id: string;
          is_muted: boolean | null;
          is_pinned: boolean | null;
          rival_user_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_muted?: boolean | null;
          is_pinned?: boolean | null;
          rival_user_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_muted?: boolean | null;
          is_pinned?: boolean | null;
          rival_user_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      shop_items: {
        Row: {
          created_at: string;
          id: string;
          is_coming_soon: boolean;
          is_featured: boolean;
          item_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_coming_soon?: boolean;
          is_featured?: boolean;
          item_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_coming_soon?: boolean;
          is_featured?: boolean;
          item_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'shop_items_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'inventory_items';
            referencedColumns: ['id'];
          },
        ];
      };
      skill_categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          category_id: string;
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          is_system: boolean;
          name: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          is_system?: boolean;
          name: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          is_system?: boolean;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'skills_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'skill_categories';
            referencedColumns: ['id'];
          },
        ];
      };
      system_moments_queue: {
        Row: {
          created_at: string | null;
          id: string;
          is_viewed: boolean | null;
          moment_type: string;
          payload: Json | null;
          priority: number | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_viewed?: boolean | null;
          moment_type: string;
          payload?: Json | null;
          priority?: number | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_viewed?: boolean | null;
          moment_type?: string;
          payload?: Json | null;
          priority?: number | null;
          user_id?: string;
        };
        Relationships: [];
      };
      system_user_state: {
        Row: {
          comeback_tier: string | null;
          created_at: string | null;
          daily_chest_status: string | null;
          daily_progress_score: number | null;
          last_login_date: string | null;
          last_progress_date: string | null;
          streak_shield_active: boolean | null;
          timezone_offset_minutes: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          comeback_tier?: string | null;
          created_at?: string | null;
          daily_chest_status?: string | null;
          daily_progress_score?: number | null;
          last_login_date?: string | null;
          last_progress_date?: string | null;
          streak_shield_active?: boolean | null;
          timezone_offset_minutes?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          comeback_tier?: string | null;
          created_at?: string | null;
          daily_chest_status?: string | null;
          daily_progress_score?: number | null;
          last_login_date?: string | null;
          last_progress_date?: string | null;
          streak_shield_active?: boolean | null;
          timezone_offset_minutes?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          achievement_id: string;
          id: string;
          unlocked_at: string;
          user_id: string;
        };
        Insert: {
          achievement_id: string;
          id?: string;
          unlocked_at?: string;
          user_id: string;
        };
        Update: {
          achievement_id?: string;
          id?: string;
          unlocked_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_achievements_achievement_id_fkey';
            columns: ['achievement_id'];
            isOneToOne: false;
            referencedRelation: 'achievements';
            referencedColumns: ['id'];
          },
        ];
      };
      user_avatar_unlocks: {
        Row: {
          unlock_id: string;
          unlocked_at: string;
          user_id: string;
        };
        Insert: {
          unlock_id: string;
          unlocked_at?: string;
          user_id: string;
        };
        Update: {
          unlock_id?: string;
          unlocked_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_avatar_unlocks_unlock_id_fkey';
            columns: ['unlock_id'];
            isOneToOne: false;
            referencedRelation: 'avatar_unlocks';
            referencedColumns: ['id'];
          },
        ];
      };
      user_badges: {
        Row: {
          badge_id: string;
          id: string;
          unlocked_at: string;
          user_id: string;
        };
        Insert: {
          badge_id: string;
          id?: string;
          unlocked_at?: string;
          user_id: string;
        };
        Update: {
          badge_id?: string;
          id?: string;
          unlocked_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_badges_badge_id_fkey';
            columns: ['badge_id'];
            isOneToOne: false;
            referencedRelation: 'badges';
            referencedColumns: ['id'];
          },
        ];
      };
      user_inventory: {
        Row: {
          acquired_at: string;
          item_id: string;
          user_id: string;
        };
        Insert: {
          acquired_at?: string;
          item_id: string;
          user_id: string;
        };
        Update: {
          acquired_at?: string;
          item_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_inventory_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'inventory_items';
            referencedColumns: ['id'];
          },
        ];
      };
      user_journey_days: {
        Row: {
          boss_id: string | null;
          chapter_number: number | null;
          completed_at: string | null;
          created_at: string;
          day_number: number;
          day_type: string | null;
          id: string;
          journey_id: string;
          mission_ids: string[] | null;
          objective: string | null;
          status: string;
          story_text: string | null;
        };
        Insert: {
          boss_id?: string | null;
          chapter_number?: number | null;
          completed_at?: string | null;
          created_at?: string;
          day_number: number;
          day_type?: string | null;
          id?: string;
          journey_id: string;
          mission_ids?: string[] | null;
          objective?: string | null;
          status?: string;
          story_text?: string | null;
        };
        Update: {
          boss_id?: string | null;
          chapter_number?: number | null;
          completed_at?: string | null;
          created_at?: string;
          day_number?: number;
          day_type?: string | null;
          id?: string;
          journey_id?: string;
          mission_ids?: string[] | null;
          objective?: string | null;
          status?: string;
          story_text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_journey_days_journey_id_fkey';
            columns: ['journey_id'];
            isOneToOne: false;
            referencedRelation: 'user_journeys';
            referencedColumns: ['id'];
          },
        ];
      };
      user_journeys: {
        Row: {
          class_path: string | null;
          created_at: string;
          current_day: number;
          duration_days: number;
          goal: string;
          id: string;
          journey_type: string | null;
          start_date: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          class_path?: string | null;
          created_at?: string;
          current_day?: number;
          duration_days: number;
          goal: string;
          id?: string;
          journey_type?: string | null;
          start_date?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          class_path?: string | null;
          created_at?: string;
          current_day?: number;
          duration_days?: number;
          goal?: string;
          id?: string;
          journey_type?: string | null;
          start_date?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_journeys_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_missions: {
        Row: {
          category: string;
          coin_reward: number;
          created_at: string;
          current_progress: number;
          description: string | null;
          difficulty: string;
          expires_at: string;
          id: string;
          is_claimed: boolean;
          is_completed: boolean;
          mission_type: string;
          rarity: string;
          required_count: number;
          title: string;
          updated_at: string;
          user_id: string;
          xp_reward: number;
        };
        Insert: {
          category: string;
          coin_reward?: number;
          created_at?: string;
          current_progress?: number;
          description?: string | null;
          difficulty: string;
          expires_at: string;
          id?: string;
          is_claimed?: boolean;
          is_completed?: boolean;
          mission_type: string;
          rarity: string;
          required_count?: number;
          title: string;
          updated_at?: string;
          user_id: string;
          xp_reward?: number;
        };
        Update: {
          category?: string;
          coin_reward?: number;
          created_at?: string;
          current_progress?: number;
          description?: string | null;
          difficulty?: string;
          expires_at?: string;
          id?: string;
          is_claimed?: boolean;
          is_completed?: boolean;
          mission_type?: string;
          rarity?: string;
          required_count?: number;
          title?: string;
          updated_at?: string;
          user_id?: string;
          xp_reward?: number;
        };
        Relationships: [];
      };
      user_progression: {
        Row: {
          coins: number;
          created_at: string;
          current_level: number;
          current_rank: string;
          gems: number;
          id: string;
          total_xp: number;
          updated_at: string;
        };
        Insert: {
          coins?: number;
          created_at?: string;
          current_level?: number;
          current_rank?: string;
          gems?: number;
          id: string;
          total_xp?: number;
          updated_at?: string;
        };
        Update: {
          coins?: number;
          created_at?: string;
          current_level?: number;
          current_rank?: string;
          gems?: number;
          id?: string;
          total_xp?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          id: string;
          notification_channels: Json | null;
          privacy_level: string | null;
          theme_preference: string | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          notification_channels?: Json | null;
          privacy_level?: string | null;
          theme_preference?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          notification_channels?: Json | null;
          privacy_level?: string | null;
          theme_preference?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_skills: {
        Row: {
          current_level: number;
          current_xp: number;
          id: string;
          last_activity_at: string;
          skill_id: string;
          started_at: string;
          user_id: string;
        };
        Insert: {
          current_level?: number;
          current_xp?: number;
          id?: string;
          last_activity_at?: string;
          skill_id: string;
          started_at?: string;
          user_id: string;
        };
        Update: {
          current_level?: number;
          current_xp?: number;
          id?: string;
          last_activity_at?: string;
          skill_id?: string;
          started_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_skills_skill_id_fkey';
            columns: ['skill_id'];
            isOneToOne: false;
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
        ];
      };
      user_stats: {
        Row: {
          created_at: string;
          current_streak: number;
          last_mission_date: string | null;
          longest_streak: number;
          total_cardio_sessions: number;
          total_coins_earned: number;
          total_gems_earned: number;
          total_pushups: number;
          total_running_distance: number;
          total_situps: number;
          total_sleep_days: number;
          total_squats: number;
          total_stretch_sessions: number;
          total_water_intake: number;
          total_workouts: number;
          total_xp_earned: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_streak?: number;
          last_mission_date?: string | null;
          longest_streak?: number;
          total_cardio_sessions?: number;
          total_coins_earned?: number;
          total_gems_earned?: number;
          total_pushups?: number;
          total_running_distance?: number;
          total_situps?: number;
          total_sleep_days?: number;
          total_squats?: number;
          total_stretch_sessions?: number;
          total_water_intake?: number;
          total_workouts?: number;
          total_xp_earned?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_streak?: number;
          last_mission_date?: string | null;
          longest_streak?: number;
          total_cardio_sessions?: number;
          total_coins_earned?: number;
          total_gems_earned?: number;
          total_pushups?: number;
          total_running_distance?: number;
          total_situps?: number;
          total_sleep_days?: number;
          total_squats?: number;
          total_stretch_sessions?: number;
          total_water_intake?: number;
          total_workouts?: number;
          total_xp_earned?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      transformation_profiles: {
        Row: {
          user_id: string;
          created_at: string;
          updated_at: string;
          start_weight?: number;
          current_weight?: number;
          goal_weight?: number;
        };
        Insert: {
          user_id: string;
          created_at?: string;
          updated_at?: string;
          start_weight?: number;
          current_weight?: number;
          goal_weight?: number;
        };
        Update: {
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          start_weight?: number;
          current_weight?: number;
          goal_weight?: number;
        };
        Relationships: [];
      };
      body_measurements: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          created_at: string;
          chest?: number | null;
          arms?: number | null;
          waist?: number | null;
          thighs?: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          created_at?: string;
          chest?: number | null;
          arms?: number | null;
          waist?: number | null;
          thighs?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          created_at?: string;
          chest?: number | null;
          arms?: number | null;
          waist?: number | null;
          thighs?: number | null;
        };
        Relationships: [];
      };
      progress_photos: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          photo_url?: string;
          front_photo_url?: string;
          back_photo_url?: string;
          side_photo_url?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          photo_url?: string;
          front_photo_url?: string;
          back_photo_url?: string;
          side_photo_url?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          photo_url?: string;
          front_photo_url?: string;
          back_photo_url?: string;
          side_photo_url?: string;
        };
        Relationships: [];
      };
      strength_records: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          created_at: string;
          exercise_key: string;
          value: number;
          unit: string;
          is_pr: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          created_at?: string;
          exercise_key: string;
          value: number;
          unit: string;
          is_pr: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          created_at?: string;
          exercise_key?: string;
          value?: number;
          unit?: string;
          is_pr?: boolean;
        };
        Relationships: [];
      };
      life_history_stats: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          total_workout_days: number;
          journeys_completed: number;
          bosses_defeated: number;
          lifetime_xp: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          total_workout_days?: number;
          journeys_completed?: number;
          bosses_defeated?: number;
          lifetime_xp?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          total_workout_days?: number;
          journeys_completed?: number;
          bosses_defeated?: number;
          lifetime_xp?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_daily_progress: {
        Args: { p_points: number; p_user_id: string };
        Returns: Json;
      };
      claim_daily_chest: { Args: { p_user_id: string }; Returns: Json };
      dev_reset_onboarding: { Args: { p_user_id: string }; Returns: undefined };
      submit_boss_contribution: {
        Args: {
          p_activity_type: string;
          p_amount: number;
          p_boss_id: string;
          p_damage_dealt: number;
          p_idempotency_key: string;
          p_objective_id: string;
          p_status: string;
          p_user_id: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      friendship_status: 'pending' | 'accepted' | 'blocked';
      notification_type:
        | 'friend_request'
        | 'friend_accepted'
        | 'new_follower'
        | 'post_like'
        | 'post_comment'
        | 'comment_reply';
      post_type: 'standard_post' | 'level_up' | 'workout' | 'boss' | 'achievement';
      reaction_type: 'fire' | 'power' | 'respect' | 'lightning' | 'heart';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      friendship_status: ['pending', 'accepted', 'blocked'],
      notification_type: [
        'friend_request',
        'friend_accepted',
        'new_follower',
        'post_like',
        'post_comment',
        'comment_reply',
      ],
      post_type: ['standard_post', 'level_up', 'workout', 'boss', 'achievement'],
      reaction_type: ['fire', 'power', 'respect', 'lightning', 'heart'],
    },
  },
} as const;
