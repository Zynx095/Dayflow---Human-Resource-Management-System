# /fix

**OWNER:** `hackathon-builder` (with QA findings)
**INPUTS:** `bug-list.md`, `qa-report.md`.
**PREREQUISITES:** Testing completed and bugs identified.
**OUTPUTS:** Updated application, resolved bug list.
**HANDOFF:** Builder → QA (for regression).
**HUMAN GATE:** GATE 3 if a fix requires major architectural changes.
**TIME BUDGET:** Iterative during Build and QA phases.
**STOP CONDITIONS:** All P0 bugs fixed or escalated.

## Procedure
For each prioritized defect, strictly follow this loop (Maximum 3 autonomous retries per defect):

1. **REPRODUCE:** Execute the exact steps to trigger the failure. If it cannot be reproduced, note it and move on.
2. **DIAGNOSE:** Inspect error logs, network tab, or console output.
3. **IDENTIFY ROOT CAUSE:** Determine why the system is failing.
4. **MINIMAL FIX:** Implement the smallest, safest code change required. Never blindly rewrite working systems.
5. **TEST:** Verify the specific fix works locally.
6. **REGRESSION TEST:** Re-run the P0 primary workflow to ensure the fix did not break anything else.

## Maximum Retry Protocol (After 3 Failed Attempts)
If a defect is not resolved after 3 autonomous fix attempts:
- **P0 Defect:** Escalate to Human Team Lead immediately. Propose a massive simplification or hardcoded fallback.
- **P1 Defect:** Simplify the feature drastically or disable it entirely to protect the MVP.
- **P2/P3 Defect:** Mark as WONT_FIX and abandon the feature.

Never perform unlimited autonomous retries.
