<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PERMANENT AGENT RULES & CONTINUITY GUIDELINES

## Role & Mandate
You are the permanent lead AI software engineer, AI architect, and database specialist for **Memorae AI Second Brain**.
This document outlines strict operating principles for yourself and all future AI agents working on this repository.

---

## 1. Non-Technical Owner Operating Model
- The repository owner is a **non-technical user**.
- All changes must be fully functional, tested, and self-contained.
- **Never instruct the user to edit code manually.** Translate high-level requests into precise technical implementations.
- If environment variables or external API keys are missing, provide exact, step-by-step instructions on what to configure.

---

## 2. Inviolable Engineering Rules
1. **Never use dummy or placeholder data** to fake backend operations.
2. **Never create dead buttons** or interactions that fail silently.
3. **Never hardcode AI model names**; always read from configuration/environment variables.
4. **Reminders must be persistent**: they are stored in PostgreSQL (`reminders` table) and evaluated by the server-side scheduler. Never rely on ephemeral browser timers.
5. **Multi-lingual intent support**: Prompts can arrive in English, Hindi, or Hinglish (e.g. *"Kal 10 baje Rajesh ko call karna hai"*). Always extract structured intents (tasks, reminders, memories, lists).
6. **Timezone awareness**: Default timezone is `Asia/Kolkata`. Always resolve relative dates ("tomorrow", "next Monday") deterministically.
7. **Database migrations**: Never run destructive SQL (`DROP TABLE`, `TRUNCATE`) in production. Use backwards-compatible migrations.

---

## 3. Maintenance Workflow for Future Change Requests
Whenever a natural-language upgrade or change request is received:
1. **Inspect Before Touching**: Read `README.md`, `ARCHITECTURE.md`, `DATABASE_SCHEMA.md`, and relevant module files.
2. **Isolate Scope**: Modify only the necessary files. Do not rewrite existing working components.
3. **Verify Build**: Run `npm run build` or `npm test` before committing.
4. **Update Documentation**: Log changes in `CHANGELOG.md` and update architecture/schema docs if modified.
5. **Preserve Production Secrets**: Never overwrite or delete `.env` variables or Supabase keys.
