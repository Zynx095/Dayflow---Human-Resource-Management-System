# Stack Selection Matrix

This template evaluates the technical requirements to determine the optimal hackathon stack. Do NOT default to specific frameworks (like Next.js, Supabase, Vercel) unless justified by this matrix.

## 1. Problem Requirements
- **Description:** [What does the app actually do?]
- **Recommendation:** [Simple SPA vs. Full SSR app]

## 2. Data Model Complexity
- **Description:** [Are there complex relationships? Heavy joins? Or simple documents?]
- **Recommendation:** [PostgreSQL/Supabase vs. NoSQL/Firebase vs. Local SQLite]
  *(Note: Choose PostgreSQL/Supabase if relational integrity or rapid backend setup is justified).*

## 3. Realtime Requirements
- **Description:** [Does the app need live updates or websockets?]
- **Recommendation:** [Polling vs. Firebase Realtime vs. Supabase Realtime]

## 4. Authentication
- **Description:** [Is secure user isolation necessary for the MVP?]
- **Recommendation:** [OAuth via Supabase/Firebase Auth vs. simple mock login]

## 5. AI Requirements
- **Description:** [What inference is needed? Vision? Fast text? Complex reasoning?]
- **Abstraction Rule:** App -> FreeLLMAPI -> [Model]
- **Recommendation:** [Specific model choice, avoiding Groq/Gemini unless explicitly required]

## 6. Offline / Local Requirements
- **Description:** [Must it run without internet for the demo?]
- **Recommendation:** [PWA features, Local SQLite, etc.]

## 7. Deployment Requirements
- **Description:** [Where will this be hosted easily?]
- **Recommendation:** [Static Host vs. Serverless vs. VM]

## 8. Team Skill & Setup Complexity
- **Description:** [What does the team know best? How fast can it be set up?]
- **Recommendation:** [Choose the fastest path to MVP]

## 9. 8-Hour Time Constraint & Reliability
- **Description:** [Can this stack be configured and deployed reliably within 8 hours?]
- **Recommendation:** [Final Yes/No validation]

## Final Stack Selection
- **Frontend:** [Choice]
- **Backend:** [Choice]
- **Database:** [Choice]
- **AI Provider via FreeLLMAPI:** [Choice]
- **Deployment Target:** [Choice]
