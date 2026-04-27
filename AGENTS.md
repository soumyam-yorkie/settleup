# SettleUp – Agent & Contributor Guidelines

This file is the **single source of truth** for coding standards, architecture boundaries, folder usage, and git workflow for this project.
AI coding agents (Cursor, Antigravity, GitHub Copilot, Claude, etc.) and human contributors should follow all rules defined here.

---

## Import Ordering

Always order imports in the following groups, separated by a **blank line**:

1. **React** — `import React from 'react'`
2. **React Native core + safe-area** — `import { View, ... } from 'react-native'` then `react-native-safe-area-context`
3. **Third-party libraries** — `@react-navigation/...`, `lucide-react-native`, etc.
4. **Internal — components** — `../../components/...`
5. **Internal — services / data** — `../../services/...`
6. **Internal — types** — `../../types/...`
7. **Internal — utils / theme** — `../../utils/...`

```ts
// ✅ Correct
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Bell } from 'lucide-react-native';

import { SummaryCard } from '../../components/SummaryCard';
import { MOCK_USER } from '../../services/mockData';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../utils/theme';
```

---

## TypeScript & React Native Standards

- Use TypeScript types for **all** public function params and return values. No `any` — use explicit interfaces/types in `src/types/`.
- Prefer **functional components** and custom hooks over class components.
- Keep components small and focused; non-UI logic belongs outside screens/components.
- Use clear names: `camelCase` for variables/functions, `PascalCase` for components/types.
- Remove dead code, unused imports, and commented-out blocks before finishing changes.
- Never hardcode the current user ID (e.g. `'u1'`) — always reference `MOCK_USER.id` or the authenticated user context.
- Guard optional fields (e.g. `avatarUrl?: string`) before passing to components: use `value ?? ''` or conditional rendering.
- All colors/spacing/shadows must come from `src/utils/theme.ts`. No hardcoded hex values in component files.

---

## Folder Structure

```
src/
  components/     # Reusable UI components (no screen-specific logic)
  navigation/     # Navigator definitions only (no UI rendering)
  screens/        # One subfolder per feature (dashboard, groups, friends, …)
  services/       # Data fetching, mock data, API clients
  types/          # Shared TypeScript interfaces and navigation param lists
  utils/          # Theme, helpers, constants
```

- **Components** must not import from `screens/`.
- **Screens** may import from `components/`, `services/`, `types/`, `utils/`.
- **Navigation** files must not contain business logic or UI beyond the navigator shell.
- New features go in their own subfolder under `screens/`.

---

## Architecture Boundaries

- Keep a clear separation: `screens → components → utils`. Never reverse this dependency.
- Data access (mock or real) lives in `services/` and is consumed by screens, never by components.
- Navigation param types live in `src/types/navigation.ts`. Keep `RootStackParamList` and `MainTabParamList` in sync with the actual navigators.
- Tab route names in `MainTabs.tsx` **must match** the keys declared in `MainTabParamList`.

---

## Design System

- All colors reference `theme.colors.*` tokens from `src/utils/theme.ts`.
- Available semantic aliases: `theme.colors.success` (green), `theme.colors.danger` (red).
- Spacing: `theme.spacing.{xs|sm|md|lg|xl|xxl}`.
- Border radius: `theme.borderRadius.{sm|md|lg|xl|xxl|xxxl|round}`.
- Shadows: `theme.shadows.{small|medium|large|fab}`.
- No inline styles for static values — use `StyleSheet.create()`.

---

## Git Workflow

- Branch naming: `feat/<short-description>`, `fix/<short-description>`, `chore/<short-description>`.
- Commit messages follow **Conventional Commits**: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
- Run `npm run lint` and confirm **0 errors** before committing.
- One logical change per commit. Keep PRs focused and reviewable.

---

## Testing Standards

- Unit tests go alongside source files or in `__tests__/` within the same module.
- Test filenames: `ComponentName.test.tsx` / `functionName.test.ts`.
- Mock external dependencies (navigation, network) in tests — never rely on real data.
- Run the full test suite before pushing: `npm test`.

---

## Strict Color Usage
- **NO HARDCODED HEX/RGBA COLORS** are allowed in any file except `src/utils/theme.ts`.
- All styles MUST use `theme.colors.*`.
- If a color is missing, add it to `src/utils/theme.ts` first.
- This applies to all components, screens, and navigation files.
