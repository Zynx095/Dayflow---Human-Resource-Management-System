# /test-everything

**OWNER:** `qa-breaker`
**INPUTS:** `build-report.md`, `smoke-test.md`, running application, `known-issues.md`.
**PREREQUISITES:** Build MVP is complete.
**OUTPUTS:** `qa-report.md`, `bug-list.md`, regression status.
**HANDOFF:** QA → UI/UX (or back to Builder for fixes).
**HUMAN GATE:** None directly, unless credentials found.
**TIME BUDGET:** T+07:00 to T+07:30 (alongside UI polish).
**STOP CONDITIONS:** All tests completed and bugs recorded.

## Procedure
1. **Security Check:** Scan for hardcoded credentials. If found, stop and alert Human Team Lead immediately.
2. **Run Build:** Execute a clean production build to catch compilation/bundling errors.
3. **API Tests:** Test all endpoints with valid data, malformed data, and missing data. Verify correct HTTP status codes.
4. **Validation Tests:** Attempt to submit forms with empty fields, extreme lengths, and invalid characters.
5. **Integration & Dynamic Data Tests:** Verify that frontend state correctly updates the database and vice-versa. Ensure no mock data exists in the critical path.
6. **Browser & Responsive Tests:** Open in a clean browser context. Resize the window to mobile widths.
7. **Primary Workflow Test:** Execute the P0 user journey end-to-end exactly as a judge would.
8. **Document:** Record all failures, errors, and vulnerabilities in `bug-list.md` and `qa-report.md` with exact reproduction steps. Do not attempt fixes during this pass.
