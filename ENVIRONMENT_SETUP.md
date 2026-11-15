# MEMORAE AI SECOND BRAIN - ENVIRONMENT SETUP

## Prerequisites
- Node.js >= 18 (Node 20+ recommended)
- npm or pnpm
- Supabase account (free tier works great)
- AI Provider API Key (OpenAI or NVIDIA NIM)

---

## 1. Quick Local Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd memorae-second-brain
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase project URL, Anon Key, and OpenAI / NVIDIA API credentials.

4. **Apply Supabase Migrations**:
   In your Supabase Dashboard:
   - Navigate to the **SQL Editor**.
   - Paste and execute the contents of `supabase/migrations/20261115000000_init_memorae_schema.sql`.

5. **Run the local dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.
