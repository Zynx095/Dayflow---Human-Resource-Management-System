# /deploy

**OWNER:** `hackathon-builder`
**INPUTS:** `build-report.md`, running local application.
**PREREQUISITES:** Build is successful and application runs locally.
**OUTPUTS:** Live deployment URL.
**HANDOFF:** Builder → QA / UI/UX.
**HUMAN GATE:** None directly (handled before final audit).
**TIME BUDGET:** Variable, execute before T+07:00.
**STOP CONDITIONS:** Application is accessible via a public URL.

## Procedure
1. **Target Selection:** Review the `templates/stack-selection.md` to identify the chosen deployment platform.
2. **Environment Configuration:** Ensure all necessary production environment variables (e.g., database URLs, API keys) are configured in the deployment environment.
3. **Build & Deploy:** Execute the deployment using the chosen platform's CLI or continuous integration setup.
4. **Verification:** Navigate to the live public URL and verify that the application loads without critical errors.
5. **Fallback:** If deployment fails or takes too long, fall back to a local runner strategy and document it for the demo.
