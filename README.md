# Real Leveling — Mobile App

> A world-class gamified self-improvement app. Android-first MVP.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native 0.86 + Expo SDK 57 (New Architecture) |
| **Navigation** | Expo Router v5 (file-based, typed routes) |
| **Styling** | NativeWind v4 + Tailwind CSS v3 |
| **Animations** | React Native Reanimated 3 |
| **State** | Zustand v5 (client) + TanStack Query v5 (server) |
| **Backend** | Supabase (Auth, PostgreSQL, Realtime, Storage) |
| **Storage** | MMKV (fast sync) + WatermelonDB (offline-first) |
| **Forms** | React Hook Form + Zod |
| **Monetization** | RevenueCat |
| **Analytics** | PostHog |

---

## Project Structure

```
REAL LEVLING/
├── apps/
│   └── mobile/           ← Expo React Native app (Android-first)
│       ├── app/          ← Expo Router file-based routes
│       ├── src/
│       │   ├── theme/    ← Design system tokens (colors, typography, etc.)
│       │   ├── features/ ← Feature-sliced modules
│       │   ├── components/ ← Shared components (ui, game, avatar, etc.)
│       │   ├── lib/      ← Core singletons (supabase, query-client, mmkv)
│       │   ├── store/    ← Zustand stores
│       │   ├── hooks/    ← Shared React hooks
│       │   ├── utils/    ← Pure utility functions
│       │   ├── constants/ ← Game balance, feature flags
│       │   ├── types/    ← Global TypeScript types
│       │   └── db/       ← WatermelonDB schema + models
│       └── docs/
├── packages/             ← Shared monorepo packages (Sprint 3+)
├── supabase/             ← SQL migrations + Edge Functions (Sprint 3)
├── .github/workflows/    ← CI/CD pipelines
└── docs/                 ← Project documentation
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Android Studio (for Android emulator) or physical Android device
- Expo Go app (for quick testing)

### 1. Clone & Install

```bash
git clone <repo-url>
cd "REAL LEVLING"
npm install
cd apps/mobile
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
# Fill in your Supabase URL, anon key, etc.
```

### 3. Start the Development Server

```bash
# From the root
npm run mobile

# Or from apps/mobile
npm run android
```

---

## Development Workflow

### Running on Android

```bash
npm run android
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Type Checking

```bash
npm run typecheck
```

### Formatting

```bash
npm run format
npm run format:check
```

---

## Code Conventions

### Imports

Always import from path aliases, never relative paths beyond 2 levels:

```typescript
// ✅ Correct
import { colors } from '@theme';
import { useAuthStore } from '@store';
import { supabase } from '@lib/supabase';

// ❌ Wrong
import { colors } from '../../theme';
```

### Styling

Use NativeWind `className` for all styling. StyleSheet only for programmatic styles (animated values, dynamic colors):

```tsx
// ✅ NativeWind
<View className="flex-1 bg-bg-surface px-screen-h" />

// ✅ StyleSheet for dynamic values
<Animated.View style={[animatedStyle, { borderColor: activeColor }]} />
```

### State

- **Zustand** for client state (user session, player data, sync status)
- **TanStack Query** for server state (leaderboard, friends list, quest history)
- Never mix them — one source of truth per data domain

---

## Supabase Type Generation

After creating or modifying tables in Supabase:

```bash
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_ID \
  > src/types/database.types.ts
```

Run this after every migration. Commit the generated file.

---

## Sprint Log

| Sprint | Status | Description |
|---|---|---|
| Sprint 0 | ✅ Complete | Technical plan, tech stack, roadmap |
| Sprint 1 | ✅ Complete | Design system document |
| Sprint 2 | ✅ Complete | Project scaffolding |
| Sprint 3 | 🔜 Next | Supabase schema + auth screens |
