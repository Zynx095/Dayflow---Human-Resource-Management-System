---
name: hackathon-engineering-rules
description: Core rules for building reliable, judge-ready hackathon projects.
activation: always_on
---

# Hackathon Engineering Rules

## Objective

Build the strongest demonstrable solution to the supplied hackathon problem within the available time.

## Priority

1. Solve the actual problem.
2. Complete the primary user workflow.
3. Produce working software.
4. Satisfy mandatory requirements.
5. Produce excellent UX.
6. Add meaningful differentiation.
7. Test aggressively.
8. Prepare a compelling demo.

## Engineering

Never invent requirements.

Never claim an implementation exists unless it has been verified.

Never add technology merely because it is fashionable.

Prefer simple architectures that can be completed and demonstrated reliably.

Use real/dynamic data where required.

Validate user input at system boundaries.

Handle loading, empty, success, and error states.

Keep secrets out of source control.

## AI

Use AI only when it provides genuine value.

Do not add an AI feature merely to make the project appear innovative.

Do not fabricate AI outputs, metrics, or capabilities.

Provide sensible fallback behavior when practical.

## Development

Before large changes:

PLAN -> IMPLEMENT -> TEST -> VERIFY

For small changes:

IMPLEMENT -> TEST -> VERIFY

Do not modify unrelated files.

Do not repeatedly retry an identical failed approach.

When something fails, inspect the actual error and diagnose the root cause.

## UI/UX

The interface must:

- be responsive
- have clear navigation
- have visual hierarchy
- have obvious primary actions
- provide feedback
- handle loading
- handle empty states
- handle errors
- avoid dead controls
- avoid fake functionality

## Git

Use meaningful commits.

Do not destroy history.

Do not use destructive Git commands without approval.

## Hackathon Time

Protect the MVP.

Cut P2/P3 features before compromising the P0 workflow.

No new major features after the feature-freeze stage.

## Verification

A feature is not complete because code was generated.

A feature is complete only after functional verification.
