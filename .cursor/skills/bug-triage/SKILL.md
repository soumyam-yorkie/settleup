---
name: bug-triage
description: Run a structured bug triage workflow for React Native issues. Use when the user reports a bug, error, regression, or unexpected app behavior.
---

# Bug Triage

## When to Use

- User reports crashes, incorrect output, warnings, or regressions.
- A fix is needed with clear root-cause reasoning.

## Workflow

1. Reproduce: confirm exact scenario, input/state, and expected vs actual behavior.
2. Isolate: narrow to layer (`screens`, `context`, `services`, `utils`, `navigation`).
3. Diagnose: identify root cause with smallest proof (logs, code path, failing condition).
4. Fix: implement minimal safe change at the correct boundary.
5. Verify: re-run checks and confirm bug no longer reproduces.
6. Prevent: add test or explicit validation steps for regression coverage.

## Output Template

- Symptom
- Root cause
- Fix summary
- Verification performed
- Residual risks (if any)
