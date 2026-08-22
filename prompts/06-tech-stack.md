Select a tech stack for this architecture using the `templates/stack-selection.md` matrix. 

**Rules:**
1. Do not hardcode or default to Next.js, Vercel, Supabase, Groq, or Gemini unless explicitly justified by the evaluation matrix.
2. PostgreSQL/Supabase is a preferred option *only* when relational data, realtime functionality, authentication, or rapid backend setup justify it.
3. Remember that SQL is the query language, PostgreSQL is the database, and Supabase is a platform.
4. All AI inference must use the abstraction: Application → FreeLLMAPI → Model. Do not mandate FreeLLMAPI as a dependency if no AI is needed.

Specify exactly how the frontend, backend, database, and AI (if any) will communicate.
