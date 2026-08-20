# /finalize

**OWNER:** `final-auditor`
**INPUTS:** `final-audit.md`, running application.
**PREREQUISITES:** GATE 5 (Demo Readiness) approved.
**OUTPUTS:** Final submission package (README, demo script, screenshots).
**HANDOFF:** Final Auditor → Human Team Lead.
**HUMAN GATE:** GATE 6 (Final Submission).
**TIME BUDGET:** T+07:45 to T+08:00.
**STOP CONDITIONS:** Project is boxed and handed to the Human for actual submission.

## Procedure
1. **Feature Freeze Enforcement:** Ensure no code has changed since the audit.
2. **Final Security Checkpoint:** Run one absolute final check for exposed secrets (`password`, `api-key`, `token`, `secret`, `bearer`) before pushing.
3. **README Creation:** Generate a comprehensive README including:
   - Project Name & Tagline
   - The Problem Solved
   - Architecture & Tech Stack
   - Local Setup Instructions
   - Judging Highlights (The USP)
4. **Demo Script & Fallback Validation:** Ensure the `demo-script.md` has the 30-second pitch, 3-minute demo, and explicitly required fallbacks (screenshots/local runner).
5. **Screenshot Capture:** Verify high-quality screenshots are present.
6. **Git Verification:** Ensure all changes are committed and pushed cleanly.
7. **Final Checklist:** Review the specific hackathon platform's submission requirements.

## Stop Condition
**STOP** for Human Team Lead review (GATE 6). The AI must NEVER submit the project autonomously.
