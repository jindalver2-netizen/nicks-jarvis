# MEMORAE AI SECOND BRAIN - API DOCUMENTATION

## Overview
All endpoints reside under the `/api` namespace in Next.js App Router and require authentication unless explicitly marked public.

---

## 1. AI & Assistant Endpoints

### `POST /api/chat`
Handles conversational messages, intent extraction, tool calling, and streaming/JSON responses.
- **Request Body**:
  ```json
  {
    "conversationId": "uuid",
    "message": "Kal 10 baje Rajesh ko phone karna hai",
    "audioUrl": "optional-string"
  }
  ```
- **Response**:
  ```json
  {
    "reply": "Rajesh ko call karne ka reminder kal subah 10:00 AM ke liye schedule kar diya gaya hai.",
    "actions": [
      {
        "type": "create_reminder",
        "status": "success",
        "data": { "title": "Call Rajesh", "remind_at": "2026-11-16T10:00:00+05:30" }
      }
    ]
  }
  ```

---

## 2. Tasks & Lists Endpoints

### `GET /api/tasks`
Fetch tasks filtered by status (`pending`, `completed`, `all`) and view (`today`, `upcoming`, `overdue`).

### `POST /api/tasks`
Create a new task with due date, priority, and subtasks.

### `PATCH /api/tasks/:id`
Toggle completion or modify task attributes.

---

## 3. Persistent Reminders & Scheduler

### `POST /api/reminders/process`
Protected background cron endpoint invoked to trigger due reminders and push notifications.
- **Headers**: `Authorization: Bearer <CRON_SECRET>`
- **Response**:
  ```json
  {
    "processed": 3,
    "delivered": 3,
    "failed": 0
  }
  ```

---

## 4. Long-Term Memory Endpoints

### `POST /api/memories`
Add a new memory with category and tags. Automatically computes embeddings if vector search is active.

### `GET /api/memories/search`
Query memories via semantic vector match or keyword fallback.
- **Query Params**: `?q=supplier&category=Business`
