# MEMORAE AI SECOND BRAIN - TESTING & ACCEPTANCE GUIDE

## Key Acceptance Tests

| Test ID | Test Scenario | Input Example | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **TEST-01** | One-time reminder | *"Remind me tomorrow at 10 AM to call Rajesh."* | Reminder is persisted in DB with `remind_at` set to tomorrow 10:00 AM IST. Survives server restart. |
| **TEST-02** | Recurring reminder | *"Every Monday at 9 AM remind me to review factory work."* | Recurring rule created in DB with weekly frequency. |
| **TEST-03** | Long-term memory save | *"Remember that Pragati Industries sells tarpaulin."* | Saved under Business memory category with vector embedding. |
| **TEST-04** | Memory recall | *"What does Pragati Industries sell?"* | Assistant queries DB and responds accurately without hallucinating. |
| **TEST-05** | Multi-intent extraction | *"Kal 10 baje Rajesh ko call karna hai aur Friday ko electricity bill pay karna hai."* | Two independent tasks/reminders are parsed and saved simultaneously. |
| **TEST-06** | Task completion | Tap checkbox on task in Task view | Task status changes to `completed`, completed_at timestamp recorded in DB. |
| **TEST-07** | Server restart survival | Kill Next.js server and restart | All reminders, memories, and tasks remain intact in Supabase. |
| **TEST-08** | Multi-tenant security | Attempt query with User B credentials | RLS blocks access to User A's private tasks and memories. |
