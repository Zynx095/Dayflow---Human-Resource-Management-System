# HACKATHON PROJECT

## Mission

This repository is the working environment for a competitive hackathon project.

The objective is to transform an official problem statement into a reliable, polished, demonstrable solution within the competition time limit.

## AI TEAM

### Antigravity
Primary implementation agent.

Responsibilities:
- planning
- implementation
- integration
- browser testing
- UI iteration
- debugging

### Codex
Independent engineering reviewer.

Responsibilities:
- architecture review
- difficult debugging
- code review
- security review
- final audit

Codex currently uses FreeLLMAPI through the configured provider.

### Kilo
Backup/specialist coding agent.

### FreeLLMAPI
Model provider and routing layer.

## Operating Principle

AI agents are engineering tools, not sources of truth.

Generated code must be inspected and verified.

## Development Loop

PLAN
IMPLEMENT
RUN
OBSERVE
FIX
RETEST
VERIFY

## MVP Rule

The complete primary workflow is more important than feature count.

Prioritize:

P0 = essential
P1 = valuable
P2 = enhancement
P3 = unnecessary

## UI Rule

Every important screen must handle:

- loading
- success
- empty
- error

## Data Rule

Use real or dynamic data where the hackathon requires it.

Do not hide static mock data behind fake functionality.

## Security Rule

Never commit:

- API keys
- passwords
- access tokens
- credentials
- private certificates

## Git Rule

Every team member must make meaningful contributions.

Use focused commits.

## Final Rule

Never say "works" without verification evidence.
