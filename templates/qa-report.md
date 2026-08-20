# QA Report
**Scope:** P0 Workflow + Edge Cases

## Found Defects
1. **[BUG-01]** Form submission fails on empty name.
   - *Repro:* Submit form without name.
   - *Expected:* Validation error.
   - *Actual:* 500 Server Error.
   - *Priority:* P0 (Must Fix)
