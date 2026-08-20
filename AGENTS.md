# HACKATHON PROJECT CONSTITUTION

## Mission

This repository is a Markdown-based operating system for a competitive hackathon project.

The objective is to transform an official problem statement into a reliable, polished, demonstrable solution within the competition time limit.

## AI TEAM

### Antigravity
Primary implementation environment/agent.

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

### Kilo
Backup/specialist coding agent.

### FreeLLMAPI
Model provider and routing layer for Codex/Kilo.

### HUMAN (Team Lead)
The ultimate authority and decision-maker.

Responsibilities:
- Approving architectural decisions.
- Enforcing the scope kill switch.
- Performing final submissions.

## Operating Principle

AI agents are engineering tools, not sources of truth. Generated code must be inspected and verified. This is a human/AI-readable operating system, not an executable orchestration runtime. The agents themselves provide execution.

## Time Control & Budget Protocol

The system operates on a default 8-hour schedule. The deadline is never extended.

- **T+00:00** problem received
- **T+00:30** requirements/MVP complete
- **T+01:00** architecture freeze
- **T+04:30** core P0 workflow working
- **T+05:30** integration/data/AI complete
- **T+06:15** feature freeze
- **T+07:00** QA/security
- **T+07:30** demo rehearsal
- **T+07:45** final audit
- **T+08:00** submission

### Scope Kill Switch
If the MVP cannot reasonably finish within the remaining time:
1. Stop new feature development.
2. Identify the smallest complete P0 workflow.
3. Remove/defer P2/P3 features entirely.
4. Simplify architecture.
5. Continue only with the reduced scope.

## Human Approval Protocol

The AI must not proceed through a mandatory gate without approval from the Human Team Lead. Minor bug fixes do not require approval.

**Required Approval Gates:**
- **GATE 1** — Scope/MVP approval
- **GATE 2** — Architecture approval
- **GATE 3** — Major scope/dependency change (DB schemas, AI providers, frameworks)
- **GATE 4** — Feature freeze
- **GATE 5** — Demo readiness
- **GATE 6** — Final submission

**Format for Gated Requests:**
```
STATUS: WAITING_FOR_HUMAN
Evidence: [Link to handoff artifacts/reports]
Decision: APPROVE / REJECT / MODIFY
```

## Formal Handoffs

A stage cannot claim completion without its required handoff evidence.

- **ARCHITECT → BUILDER:** `requirements.md`, MVP definition, `architecture.md`, `implementation-plan.md`
- **BUILDER → QA:** `build-report.md`, `smoke-test.md`, running application, `known-issues.md`
- **QA → UI/UX:** `qa-report.md`, bug list, regression status
- **UI/UX → FINAL AUDITOR:** `ux-report.md`, screenshots, responsive verification
- **FINAL AUDITOR → HUMAN:** `final-audit.md`, final checklist, submission readiness
