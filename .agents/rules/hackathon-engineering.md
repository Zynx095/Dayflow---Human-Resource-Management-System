---
name: hackathon-engineering-rules
description: Detailed operational rules for building reliable, judge-ready hackathon projects.
activation: always_on
---

# Hackathon Engineering Rules

## Canonical Development Loop
For any major or minor changes, consistently follow this singular development loop:

**PLAN → IMPLEMENT → RUN → OBSERVE → FIX → RETEST → VERIFY**

## MVP Rule
The complete primary workflow is more important than feature count. Prioritize:
- **P0** = essential
- **P1** = valuable
- **P2** = enhancement
- **P3** = unnecessary

## UI & Accessibility Rule
Every important screen must handle:
- loading
- success
- empty
- error

**Accessibility Minimums:**
- Keyboard navigation (tab support).
- Visible focus states.
- Readable text contrast.
- Semantic HTML controls.
- Descriptive labels for inputs.
- Useful, actionable error messages.
- Reasonable touch target sizes (mobile-friendly).
- Responsive layout across breakpoints.

## Data Rule
Use real or dynamic data where the hackathon requires it. Do not hide static mock data behind fake functionality. Clearly labeled seed/demo data used only for initialization is allowed.

## Security Rule
Never commit:
- API keys
- passwords
- access tokens
- credentials
- private certificates

*Security Checkpoint:* A simple security review (scanning for `password`, `key`, `token`, `secret`, `bearer`) must occur before major commits and before finalization.

## Git Rule
Every team member must make meaningful contributions. Use focused commits. Do not destroy history. Do not use destructive Git commands without approval.

## Final Verification Rule
Never claim "works" or that an implementation exists unless it has been verified with evidence. A feature is complete only after functional verification.
