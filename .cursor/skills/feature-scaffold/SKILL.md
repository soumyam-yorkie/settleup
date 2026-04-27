---
name: feature-scaffold
description: Scaffold a new React Native feature across screens, components, context, services, types, and utils. Use when the user asks to add a new feature or module in this repo.
---

# Feature Scaffold

## When to Use

- User asks to add a new feature/module.
- Work touches multiple `src` layers and needs consistent placement.

## Workflow

1. Define the feature scope and expected user flow.
2. Create/update types in `src/types` first.
3. Add side-effect logic in `src/services` (storage/network boundaries).
4. Add shared state and actions in `src/context`.
5. Build screen-level UI in `src/screens` and reusable UI in `src/components`.
6. Add pure helpers in `src/utils`.
7. Wire navigation in `src/navigation` only after screen contracts are clear.
8. Add tests for changed behavior (utils/context first).

## Output Checklist

- [ ] Types added or updated
- [ ] Service boundary defined
- [ ] Context actions/selectors exposed
- [ ] Screen wired to context
- [ ] Navigation route updated (if needed)
- [ ] Validation/test notes included
