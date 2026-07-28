import { type Database } from './database.types';

/**
 * Extended Database Types
 *
 * Temporarily extends the auto-generated Supabase types with columns and tables
 * that are required by the Sprint 2 engine architectures but are pending
 * execution in the database migrations.
 *
 * This allows strict type-safety without using 'any'.
 */

type ExtractTables<D> = D extends { public: { Tables: infer T } } ? T : never;
type BaseTables = ExtractTables<Database>;

export type ExtendedDatabase = Omit<Database, 'public'> & {
  public: {
    Tables: BaseTables & {
      stats: {
        Row: {
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_active_date: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: never[];
      };
      player_levels: {
        Row: {
          level: number;
          title: string;
          xp_required: number;
          description: string | null;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: never[];
      };

      profiles: {
        Row: BaseTables['profiles']['Row'] & {
          level: number;
          xp: number;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: never[];
      };
      rewards_history: {
        Row: BaseTables['rewards_history']['Row'] & {
          xp: number;
          source: string;
          source_id: string | null;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: never[];
      };
    };
    Views: Database['public']['Views'];
    Functions: Database['public']['Functions'];
    Enums: Database['public']['Enums'];
    CompositeTypes: Database['public']['CompositeTypes'];
  };
};

export type ExtendedRow<TableName extends keyof ExtendedDatabase['public']['Tables']> =
  ExtendedDatabase['public']['Tables'][TableName]['Row'];
