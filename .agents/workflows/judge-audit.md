# /judge-audit

**OWNER:** `final-auditor`
**INPUTS:** `requirements.md`, `ux-report.md`, `qa-report.md`, `security-report.md`, all other handoff artifacts.
**PREREQUISITES:** Feature freeze (GATE 4).
**OUTPUTS:** `final-audit.md`.
**HANDOFF:** Final Auditor → Human Team Lead.
**HUMAN GATE:** GATE 5 (Demo readiness) required after audit.
**TIME BUDGET:** T+07:45 to T+08:00.
**STOP CONDITIONS:** Audit complete, report generated.

## Procedure
The `final-auditor` explicitly consumes evidence and NEVER modifies code.

1. **Problem Relevance:** Does the MVP actually solve the original problem statement?
2. **Completeness:** Can a user complete the primary workflow without hitting a dead end?
3. **Dynamic Data Verification (MANDATORY):**
   - Identify the actual source.
   - Trace source → backend → frontend.
   - Identify refresh/update mechanism.
   - Perform an actual change/update (in simulation/test).
   - Verify the UI reflects the changed value.
   - *Hardcoded mock data in the critical path = FAIL.*
4. **UI/UX & Accessibility:** Is the UI responsive, clear, polished, and accessible?
5. **Robustness:** Does the app survive basic input validation tests?
6. **API/Database Quality:** Are the APIs RESTful? Is the DB schema logical?
7. **Offline/Local Strategy:** Will the demo work on bad Wi-Fi?
8. **Security:** Are there exposed secrets?
9. **Git History:** Does the repo show meaningful commits?
10. **Demo Reliability:** Is the app stable enough to survive the demo?

## Output
Produce `final-audit.md` grading each criterion strictly as **PASS / PARTIAL / FAIL**, accompanied by explicit evidence from the input artifacts.
