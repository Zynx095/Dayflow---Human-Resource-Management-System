$templatesPath = "e:\HACKATHON\templates"
$promptsPath = "e:\HACKATHON\prompts"

# --- TEMPLATES ---

$t_requirements = @"
# Requirements Definition
**Objective:** [Brief summary of the hackathon goal]
**Target Users:** [Who is this for?]
**Pain Points:** [What are we solving?]

## Features (Strict Ranking)
### P0 - Essential (The MVP)
- [ ] Feature 1

### P1 - Valuable
- [ ] Feature 2

### P2/P3 - Out of Scope
- [ ] Feature 3

## Constraints & Risks
- [Constraint 1]
- [Risk 1]
"@

$t_architecture = @"
# System Architecture
**Stack:** Frontend: [Framework], Backend: [Framework], DB: [Database]

## Component Boundaries
- **Frontend App:** [Responsibilities]
- **API Server:** [Responsibilities]
- **Database:** [Responsibilities]

## Data Flow
[User] -> [Frontend] -> (REST/GraphQL) -> [Backend] -> [DB]

## Offline / Fallback Strategy
[What happens when the internet fails during the demo?]
"@

$t_implementation_plan = @"
# Implementation Plan & Schedule

## 8-Hour Schedule Assignment
- T+00:30 [ ] MVP Defined
- T+01:00 [ ] Architecture Frozen
- T+04:30 [ ] P0 Workflow Working
- T+05:30 [ ] Integrations Complete
- T+06:15 [ ] Feature Freeze
- T+07:45 [ ] Final Audit Done

## Scope Kill Switch Trigger
If behind schedule by T+05:30, immediately cut:
- [Cut target 1]
- [Cut target 2]
"@

$t_api = @"
# API Contract
## Base URL: `/api/v1`

### Endpoint: `POST /example`
**Purpose:** [What it does]
**Request:**
\`\`\`json
{ "key": "value" }
\`\`\`
**Response (Success 200):**
\`\`\`json
{ "status": "success", "data": {} }
\`\`\`
**Response (Error 400):**
\`\`\`json
{ "error": "Invalid input" }
\`\`\`
"@

$t_database = @"
# Database Schema
**Engine:** [SQLite / PostgreSQL / Firebase]

## Table: `users`
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `created_at` (Timestamp)

## Seed Data Strategy
- Create 3 mock users.
- Create 5 mock records for the primary dashboard.
"@

$t_build_report = @"
# Build Report
**Timestamp:** [Date/Time]
**Status:** [SUCCESS / FAIL]

## Build Commands Used
\`\`\`bash
npm run build
\`\`\`

## Warnings / Errors
- [List any warnings that did not fail the build]
"@

$t_smoke_test = @"
# Smoke Test Report
**Tester:** [Agent/Human]

## P0 Workflow Walkthrough
1. Navigate to `/` -> **PASS**
2. Click 'Start' -> **PASS**
3. Submit Form -> **FAIL** (Error 500)
4. View Result -> **UNTESTED**
"@

$t_qa_report = @"
# QA Report
**Scope:** P0 Workflow + Edge Cases

## Found Defects
1. **[BUG-01]** Form submission fails on empty name.
   - *Repro:* Submit form without name.
   - *Expected:* Validation error.
   - *Actual:* 500 Server Error.
   - *Priority:* P0 (Must Fix)
"@

$t_security_report = @"
# Security Audit Report

## Credential Scan
- **Result:** [PASS / FAIL]
- **Details:** Found `api_key` in `.env` (Ignored from git). No secrets in source code.

## Vulnerability Scan
- **Input Validation:** [PASS / FAIL] (All APIs validate input).
- **CORS:** [PASS / FAIL] (Restricted to localhost/domain).
"@

$t_ux_report = @"
# UX / UI Audit Report

## Accessibility Minimums
- [ ] Keyboard Navigable
- [ ] Contrast Accessible
- [ ] Descriptive Labels

## High-Impact Visual Fixes Required
1. [Fix 1: Make primary button larger]
2. [Fix 2: Add loading state to form]
"@

$t_final_audit = @"
# Final Audit (Hostile Judge Simulation)

## Criteria Grading
1. **Problem Relevance:** [PASS/PARTIAL/FAIL] - Evidence: ...
2. **Completeness:** [PASS/PARTIAL/FAIL] - Evidence: ...
3. **Dynamic Data:** [PASS/PARTIAL/FAIL] - Evidence: ...
4. **Demo Reliability:** [PASS/PARTIAL/FAIL] - Evidence: ...
5. **Security:** [PASS/PARTIAL/FAIL] - Evidence: ...

## Submission Recommendation
**[APPROVED / REJECTED]**
"@

$t_demo_script = @"
# Demo Script & Fallbacks

## 30-Second Pitch
[The Problem] + [Our Solution] + [The USP]

## 3-Minute Walkthrough (Live)
1. "Welcome to [App Name]. Here is the main dashboard."
2. "Let's upload a file..."
3. [The WOW Moment]
4. "As you can see, the result is instantaneous."

## Fallback Plan (T+07:00 Readiness)
- **Primary:** Live URL
- **Backup 1:** Localhost
- **Backup 2:** Screenshots in `/docs`
"@

$t_known_issues = @"
# Known Issues (Post-Release)

## WONT_FIX (P2/P3)
- Profile picture upload fails if >5MB. (Out of scope for MVP).

## Discovered Edge Cases
- Rapidly clicking submit creates duplicate records.
"@

Set-Content -Path (Join-Path $templatesPath "requirements.md") -Value $t_requirements
Set-Content -Path (Join-Path $templatesPath "architecture.md") -Value $t_architecture
Set-Content -Path (Join-Path $templatesPath "implementation-plan.md") -Value $t_implementation_plan
Set-Content -Path (Join-Path $templatesPath "api.md") -Value $t_api
Set-Content -Path (Join-Path $templatesPath "database.md") -Value $t_database
Set-Content -Path (Join-Path $templatesPath "build-report.md") -Value $t_build_report
Set-Content -Path (Join-Path $templatesPath "smoke-test.md") -Value $t_smoke_test
Set-Content -Path (Join-Path $templatesPath "qa-report.md") -Value $t_qa_report
Set-Content -Path (Join-Path $templatesPath "security-report.md") -Value $t_security_report
Set-Content -Path (Join-Path $templatesPath "ux-report.md") -Value $t_ux_report
Set-Content -Path (Join-Path $templatesPath "final-audit.md") -Value $t_final_audit
Set-Content -Path (Join-Path $templatesPath "demo-script.md") -Value $t_demo_script
Set-Content -Path (Join-Path $templatesPath "known-issues.md") -Value $t_known_issues

# --- PROMPTS ---

$prompts = @{
    "01-problem-analysis.md" = "Analyze the following hackathon problem statement. Extract the target users, core pain points, and mandatory constraints. Ignore nice-to-have features."
    "02-market-research.md" = "Research competitors for this idea. What are their weaknesses? How can we differentiate in a 3-minute hackathon demo?"
    "03-winning-solution.md" = "Based on the problem and research, propose 3 solution angles. Which one is most feasible to build in 6 hours while maximizing the 'wow' factor?"
    "04-mvp-selection.md" = "Ruthlessly cut this feature list down to a P0 MVP. The user must be able to complete one primary journey. Discard everything else."
    "05-architecture.md" = "Design a system architecture for this MVP. Prioritize speed of development and reliability during a demo over scalable enterprise patterns."
    "06-tech-stack.md" = "Select a tech stack for this architecture. Default to familiar, low-config tools. Specify exactly how the frontend, backend, and DB will communicate."
    "07-ui-ux.md" = "Generate a UI layout plan. Where is the primary call to action? How do we handle loading, empty, and error states on every major screen?"
    "08-ai-strategy.md" = "We need an AI feature. Define the model, the exact prompt, the JSON output schema, and the fallback behavior if the API timeouts."
    "09-build.md" = "Act as the Hackathon Builder. Scaffold the project, implement the database schema, write the core endpoints, and build the P0 frontend screens."
    "10-debug.md" = "I am getting this error: [ERROR]. Diagnose the root cause. Provide the smallest, safest fix. Do not rewrite the entire function."
    "11-testing.md" = "Act as QA Breaker. Generate 5 adversarial test cases to try and break the P0 workflow, including empty inputs and network failures."
    "12-security.md" = "Review this codebase for exposed secrets, hardcoded API keys, and missing CORS protections. We cannot afford disqualification."
    "13-judge-audit.md" = "Simulate a hostile hackathon judge. Grade this MVP on Problem Relevance, Completeness, Dynamic Data, UI Polish, and Stability (PASS/PARTIAL/FAIL)."
    "14-demo.md" = "Draft a 3-minute demo script. Identify the 'wow' moment. Tell me exactly when to click what."
    "15-pitch-deck.md" = "Write the content for a 5-slide pitch deck: Title, The Problem, The Solution (MVP), Differentiation, Team/Future."
    "16-judge-questions.md" = "Anticipate the 3 hardest questions the judges will ask after the demo. Provide concise, confident answers."
}

foreach ($key in $prompts.Keys) {
    Set-Content -Path (Join-Path $promptsPath $key) -Value $prompts[$key]
}

Write-Host "Created 13 templates and 16 prompts."
