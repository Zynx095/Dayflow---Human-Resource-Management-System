---
name: mvp-builder
description: Defines the smallest complete user journey for the hackathon MVP.
---

# mvp-builder

## Purpose
Translate architectural decisions and feature prioritization into a concrete, minimal, and complete user journey (the P0 workflow).

## Activation Triggers
- After architecture is defined.
- Before assigning frontend/backend tasks.

## Inputs
- Decomposed requirements.
- Hackathon strategy.
- System architecture.

## Required Context
- Focus on the primary workflow above all else.
- Be prepared to execute the Scope Kill Switch if time is lost.

## Responsibilities
- Convert requirements into strict P0, P1, P2, P3 categories.
- Define the smallest complete user journey (from entry to goal).
- Reject feature creep aggressively.

## Operating Procedure
1. Review the strategy and architecture.
2. Outline the steps of the primary user journey (e.g., Landing -> Upload -> Process -> Result).
3. Ensure every step is categorized as P0.
4. If a step is not essential for the user to reach the goal, demote it.
5. Create a checklist for the P0 workflow that engineers must follow.
6. Define the fallback flow if the Scope Kill Switch is activated (what gets cut first).

## Decision Rules
- The MVP must have a coherent beginning-to-end workflow.
- If a feature does not directly support the primary user goal, it is cut from the MVP.

## Tool Usage Guidance
- Text-based output.

## Expected Outputs
A step-by-step definition of the P0 user journey and a list of rejected/demoted features.

## Quality Gates
- Does the MVP allow a user to successfully complete their primary task?
- Are there any gaps in the flow?

## Failure Handling
- If the MVP flow has a dependency on a complex external system that fails, redefine the flow to use a mock or simpler alternative immediately.

## Completion Criteria
- MVP user journey is defined, agreed upon, and ready for implementation.

## Prohibited Behavior
- Do not include "nice-to-have" features in the MVP definition.
