---
name: commit-helper
description: Generate concise conventional commit messages for this repository. Use when the user asks for a commit title/body based on current changes.
---

# Commit Helper

## When to Use

- User asks for commit message suggestions.
- Changes are ready and need clear, consistent commit wording.

## Workflow

1. Identify dominant change type (`feat`, `fix`, `refactor`, `chore`, `docs`, `test`).
2. Summarize the intent in one line (imperative, concise).
3. Add optional body lines for why/impact when needed.
4. Ensure message reflects only included changes.

## Output Template

```text
<type>: <short summary>

<optional why/impact line 1>
<optional why/impact line 2>
```

## Quality Checks

- Title is one line and specific.
- No unrelated details from unstaged or future work.
- Language is simple and direct.
