# Sprint 3A — Foundation Architecture

## Scope

This sprint introduces the core data layer for the Real Leveling app. It is strictly limited to 5 core tables.

## Explicitly Out of Scope

The following features are NOT part of this sprint and have no placeholder code. Do not assume they exist:

- **XP Ledger & Leveling Engine**: `user_skills` stores `current_xp` as a plain column. The ledger transaction table and level-up Edge Functions are reserved for Sprint 3B.
- **Economy**: Coins and shop items.
- **Social**: Friends, guilds, and leaderboards.
- **Missions**: Daily, weekly, or seasonal quests.

## Database Schema Overview

1. `profiles`: Public-facing user identity. 1:1 with `auth.users`.
2. `user_settings`: Private user preferences (notifications, privacy, theme). 1:1 with `auth.users`.
3. `skill_categories`: Top-level taxonomy (e.g. Strength, Mind). Static reference data.
4. `skills`: Trackable skills. Can be system-defined or custom created by users.
5. `user_skills`: Join table tracking a user's progression state for a specific skill.

## Row Level Security (RLS) Model

We use an **ownership-first** model:

- Users can view and modify their own `profiles`, `user_settings`, and `user_skills`.
- `profiles` are public read-only to support player cards and leaderboards.
- `skill_categories` and system `skills` are public read-only reference data.
- Custom `skills` are viewable and modifiable only by the user who created them (`created_by`).

## Repository Pattern Integration

Data access is wrapped in a type-safe repository layer using the `Result<T, E>` pattern to avoid throwing exceptions across boundaries.

- **Interfaces**: Defined in `src/db/repositories/interfaces.ts`.
- **Implementations**: Located in `src/db/repositories/supabase/`.
- **Dependency Injection**: `src/db/repositories/index.ts` exposes instantiated singletons. Feature code should import from here to remain completely decoupled from Supabase client details.
