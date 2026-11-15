# Memorae AI Second Brain

> **A production-ready, mobile-first Personal AI Assistant & Second Brain inspired by Memorae.ai.**  
> Turn conversational speech and text in **English, Hindi, and Hinglish** into persistent reminders, structured tasks, and long-term searchable memory.

---

## 🌟 Core Highlights

- **Mobile-First Progressive Web App (PWA)**: Designed specifically for an Android-native feel with bottom navigation, floating quick-capture trigger, and installable manifest.
- **Multilingual Natural Language Understanding**: Speaks and parses English, Hindi, and Hinglish (e.g. *"Kal 10 baje Rajesh ko payment ke liye call karna hai"*).
- **Persistent, Server-Restart-Proof Reminders**: Reminders are stored in Supabase PostgreSQL and processed by a dedicated scheduler. They survive server restarts and do not rely on browser tabs staying open.
- **Long-Term Memory Hub**: Categorized personal knowledge base with semantic vector retrieval (`pgvector`) and keyword search.
- **Universal AI Provider**: Configurable layer supporting **OpenAI (GPT-4o)**, **NVIDIA NIM (Llama 3.1)**, or **Gemini (OpenAI-compatible REST)** without hardcoding model names.
- **Permanent AI Continuity Ready**: Equipped with complete documentation (`AGENTS.md`, `ARCHITECTURE.md`, `DATABASE_SCHEMA.md`, etc.) so future AI agents can maintain and upgrade features via natural language.

---

## 📱 Navigation Structure

1. **Home**: Daily briefing, upcoming reminders, priority tasks, and recent memories.
2. **Assistant**: Multi-turn AI chat with voice recording (Hindi/English) and action extraction.
3. **Tasks**: GTD task management with status filters (`Today`, `Upcoming`, `Completed`, `All`), priorities, and subtasks.
4. **Memory**: Second Brain knowledge base filtered by categories (`Business`, `Personal`, `People`, `Important Dates`, etc.).
5. **Profile**: Assistant customization, language preferences, AI model selection, and timezone settings (`Asia/Kolkata`).
6. **Quick Capture (Floating +)**: Instant modal to speak or type notes, reminders, or tasks on the go.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js >= 18
- Supabase account (free tier)
- OpenAI API key or NVIDIA NIM API key

### 2. Setup
```bash
git clone <your-repo>
cd memorae-second-brain
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` and add your keys:
```bash
cp .env.example .env.local
```

### 4. Database Setup
1. In your Supabase Dashboard, open the **SQL Editor**.
2. Run the script located in `supabase/migrations/20261115000000_init_memorae_schema.sql`.

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your desktop or mobile browser.

---

## 📂 Project Structure

```
memorae-second-brain/
├── AGENTS.md                  # Permanent AI engineering rules
├── ARCHITECTURE.md            # System architecture & data flow
├── DATABASE_SCHEMA.md         # Schema, RLS, and pgvector docs
├── API_DOCUMENTATION.md       # API routes and payloads
├── ENVIRONMENT_SETUP.md       # Step-by-step setup guide
├── DEPLOYMENT_GUIDE.md        # Vercel & GitHub CI/CD guide
├── TESTING_GUIDE.md           # Acceptance test scenarios
├── CHANGELOG.md               # Version history
├── public/
│   └── manifest.json          # Android PWA manifest
├── src/
│   ├── app/
│   │   ├── api/chat/          # AI conversational extraction endpoint
│   │   ├── api/reminders/     # Persistent reminder cron worker
│   │   ├── layout.tsx         # Root layout with PWA metadata
│   │   └── page.tsx           # Main application controller
│   ├── components/
│   │   ├── navigation/        # Bottom navigation bar
│   │   ├── quick-capture/     # Floating voice/text capture modal
│   │   ├── dashboard/         # Home dashboard & daily briefing
│   │   ├── chat/              # Conversational chat interface
│   │   ├── tasks/             # Task & action manager
│   │   ├── memory/            # Second Brain knowledge base
│   │   └── profile/           # User preferences & model settings
│   └── lib/
│       ├── ai-provider.ts     # Universal AI Provider abstraction
│       ├── supabase.ts        # Supabase client & service helpers
│       └── types.ts           # Unified TypeScript definitions
└── supabase/
    └── migrations/            # SQL migration scripts
```

<!-- Deployment trigger: 2026-11-15 19:06:45 -->
