# /polish-ui

**OWNER:** `ui-ux-specialist`
**INPUTS:** `qa-report.md`, `bug-list.md`, running application.
**PREREQUISITES:** Core QA complete.
**OUTPUTS:** `ux-report.md`, screenshots, responsive verification.
**HANDOFF:** UI/UX → Final Auditor.
**HUMAN GATE:** None directly.
**TIME BUDGET:** T+05:30 to T+07:00 (interleaved with QA).
**STOP CONDITIONS:** Application looks premium, usable, and accessible.

## Procedure
Inspect the actual running application using the `ui-ux-critic` constraints.

1. **Accessibility Minimums Check:** Verify keyboard navigation, visible focus, readable contrast, semantic controls, descriptive labels, and reasonable touch targets.
2. **Visual Hierarchy Check:** Are primary actions obvious? Are secondary actions visually demoted?
3. **Spacing & Typography Check:** Ensure consistent margins, padding, and font scales. Fix clashing colors.
4. **Navigation Check:** Ensure the user can always navigate back or return home.
5. **State Checks:** Ensure loading, empty, error, and success states are handled gracefully and are user-friendly.
6. **Mobile/Responsiveness:** Verify the core flow is usable on mobile breakpoints.
7. **Document:** Output `ux-report.md` and capture updated screenshots.

## Rule Enforcement
- Fix only high-impact issues first. Ignore minor pixel-pushing if time is constrained.
- Do not introduce massive redesigns or layout overhauls.
