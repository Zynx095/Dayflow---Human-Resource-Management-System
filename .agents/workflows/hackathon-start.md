# /hackathon-start

**OWNER:** `hackathon-architect`
**INPUTS:** Official problem statement, judging criteria.
**PREREQUISITES:** None (Start of hackathon).
**OUTPUTS:** `requirements.md`, MVP definition, `architecture.md`, `implementation-plan.md`.
**HANDOFF:** Architect → Builder.
**HUMAN GATE:** GATE 1 (Scope/MVP), GATE 2 (Architecture), and GATE 3 (STACK FREEZE).
**TIME BUDGET:** T+00:00 to T+01:00.
**STOP CONDITIONS:** Plan approved by Human Team Lead.

## Procedure
1. **Problem Analysis:** Analyze the official problem statement to extract constraints, users, and core objectives.
2. **Requirements Extraction:** Identify explicit and implicit requirements, ranking them from P0 (essential) to P3 (unnecessary).
3. **Targeted Research:** Conduct time-boxed research on existing solutions, competitors, and potential APIs.
4. **Strategy Formulation:** Define the strongest solution direction, target user needs, and the unique selling proposition (USP).
5. **MVP Definition:** Strip away all P2/P3 features to define the smallest, complete user journey. Stop and request **GATE 1** approval.
6. **Architecture Proposal:** Create a simple, implementable system architecture, data flow, and tech stack proposal. Include an offline/local fallback strategy. Request **GATE 2** approval.
7. **Stack Selection:** Evaluate tech stack criteria using `templates/stack-selection.md`. Do not hardcode specific frameworks or providers (e.g., Next.js, Supabase, Groq) unless justified by requirements (e.g., relational data, auth, team skills).
8. **Stack Freeze:** Request **GATE 3** approval for the finalized stack.
9. **Risk Assessment:** Identify potential risks (e.g., API limits, complex integrations).
10. **Schedule Creation:** Adopt the 8-hour time control budget.
11. **Final Handoff:** Pass the plan to Builder.
