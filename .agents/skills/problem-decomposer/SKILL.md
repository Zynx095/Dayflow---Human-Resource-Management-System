---
name: problem-decomposer
description: Breaks down hackathon problem statements into actionable requirements and user needs.
---

# problem-decomposer

## Purpose
Convert official problem statements into structured, implementable requirements tailored for an 8-hour hackathon constraints.

## Activation Triggers
- When a new hackathon problem statement is received.
- When requirements are unclear or need breaking down into P0, P1, P2, P3 levels.

## Inputs
- Official problem statement text.
- Judging criteria (if available).
- Hackathon rules and time constraints.

## Required Context
- Understanding of the MVP Rule (The complete primary workflow is more important than feature count).
- Time limit (typically 8 hours).

## Responsibilities
- Extract objective, users, and pain points.
- Identify explicit and implicit requirements.
- Categorize features into P0 (essential), P1 (valuable), P2 (enhancement), P3 (unnecessary).
- Define acceptance criteria and assumptions.
- Identify unknowns and judge-relevant requirements.

## Operating Procedure
1. Read the problem statement thoroughly.
2. Identify the core objective and target users.
3. List the pain points the solution must address.
4. Extract all explicit requirements.
5. Infer implicit requirements necessary to make the solution viable.
6. Rank features (P0 to P3). Be ruthless in cutting P2/P3.
7. Define acceptance criteria for the P0 workflow.
8. Document any assumptions or unknowns.
9. Outline what judges are specifically looking for based on criteria.

## Decision Rules
- If a feature is not strictly required to complete the primary user workflow, it is P1 or lower.
- Never invent requirements not supported by the problem statement or logical inference.

## Tool Usage Guidance
- Use read-only tools to view any provided problem definition files.

## Expected Outputs
A structured requirements document including: objective, users, pain points, constraints, explicit/implicit requirements, P0-P3 breakdown, acceptance criteria, assumptions, unknowns, risks, and judge-relevant criteria.

## Quality Gates
- Does the P0 list represent a fully functional, complete beginning-to-end user journey?
- Are assumptions clearly separated from facts?

## Failure Handling
- If the problem statement is completely ambiguous, define a reasonable, narrow interpretation and explicitly document it as an assumption before proceeding.

## Completion Criteria
- A fully documented breakdown has been produced and reviewed against the original problem statement.

## Prohibited Behavior
- Never invent requirements that expand scope unnecessarily.
