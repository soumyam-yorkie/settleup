---
name: product-to-tasks
description: Convert product spec sections into implementation-ready engineering tasks. Use when planning from docs like docs/product.md or feature requirement notes.
---

# Product to Tasks

## When to Use

- User asks for a build plan from product requirements.
- Requirements exist but implementation tasks are not yet structured.

## Workflow

1. Extract user goal, core flow, and non-goals from the spec section.
2. Break work into vertical slices with visible user value.
3. Map each slice to concrete files/folders in this repo structure.
4. Define acceptance checks for each task.
5. Flag open decisions separately from executable tasks.

## Output Format

- Objective (1-2 lines)
- Task list (ordered by dependency)
- Acceptance criteria per task
- Risks/unknowns

## Constraints

- Prefer smallest shippable slice first.
- Avoid backend-dependent tasks unless explicitly requested.
