# /build-mvp

**OWNER:** `hackathon-builder`
**INPUTS:** `requirements.md`, MVP definition, `architecture.md`, `implementation-plan.md`.
**PREREQUISITES:** GATE 1 and GATE 2 approved.
**OUTPUTS:** `build-report.md`, `smoke-test.md`, running application, `known-issues.md`.
**HANDOFF:** Builder → QA.
**HUMAN GATE:** GATE 3 (Major scope/dependency change) - required ONLY if the plan must change during build.
**TIME BUDGET:** T+01:00 to T+05:30.
**STOP CONDITIONS:** P0 workflow is complete, testable, and the build succeeds.

## Procedure
1. **Initialize Project:** Scaffold the repository using the approved tech stack. Do not install unapproved major dependencies (Requires GATE 3).
2. **Establish Database:** Initialize the database and run the seed script with clearly labeled demo data.
3. **Implement Backend:** Build the required API endpoints with strict input validation and basic error handling.
4. **Implement Frontend:** Build the responsive UI, handling loading, success, empty, and error states. Ensure baseline accessibility (keyboard nav, semantic HTML).
5. **Connect Components:** Wire the frontend to the backend APIs.
6. **Integrate Dynamic Data:** Execute dynamic data verification. Replace all static mock data in the critical path with dynamic data.
7. **Integrate AI (if justified):** Add AI features using structured outputs and fallback mechanisms.
8. **Test Primary Workflow:** Perform a manual smoke test of the complete P0 user journey. Output `smoke-test.md`.
9. **Run Build:** Compile the application. Output `build-report.md`.
10. **Compile Issues:** Note any unhandled edge cases in `known-issues.md`.

## Rule Enforcement
- Never start P2 features while the P0 workflow is broken.
- Do not hide static mock data behind fake functionality.
- Implement the Scope Kill Switch if behind schedule.
