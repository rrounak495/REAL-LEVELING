/**
 * src/types/database.types.ts
 *
 * Generated Supabase types.
 * (Currently hand-drafted for Sprint 3A until local Supabase generation runs)
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          country: string | null;
          timezone: string | null;
          level: number;
          xp: number;
          rank: string;
          coins: number;
          gems: number;
          onboarding_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          country?: string | null;
          timezone?: string | null;
          level?: number;
          xp?: number;
          rank?: string;
          coins?: number;
          gems?: number;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          country?: string | null;
          timezone?: string | null;
          level?: number;
          xp?: number;
          rank?: string;
          coins?: number;
          gems?: number;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: 'user_settings_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      skill_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string | null;
          is_system: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          description?: string | null;
          is_system?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          description?: string | null;
          is_system?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'skills_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'skill_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'skills_created_by_fkey';
            columns: ['created_by'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_skills: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          current_xp: number;
          current_level: number;
          started_at: string;
          last_activity_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id: string;
          current_xp?: number;
          current_level?: number;
          started_at?: string;
          last_activity_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_id?: string;
          current_xp?: number;
          current_level?: number;
          started_at?: string;
          last_activity_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_skills_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_skills_skill_id_fkey';
            columns: ['skill_id'];
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
        ];
      };
      avatar_configs: {
        Row: {
          id: string;
          base_model: string;
          hair_id: string | null;
          hair_color: string | null;
          eyes_id: string | null;
          eye_color: string | null;
          outfit_id: string | null;
          aura_id: string | null;
          accessory_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          base_model?: string;
          hair_id?: string | null;
          hair_color?: string | null;
          eyes_id?: string | null;
          eye_color?: string | null;
          outfit_id?: string | null;
          aura_id?: string | null;
          accessory_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          base_model?: string;
          hair_id?: string | null;
          hair_color?: string | null;
          eyes_id?: string | null;
          eye_color?: string | null;
          outfit_id?: string | null;
          aura_id?: string | null;
          accessory_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'avatar_configs_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
