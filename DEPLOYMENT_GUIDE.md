# MEMORAE AI SECOND BRAIN - DEPLOYMENT GUIDE

## Vercel Deployment

1. **Push to GitHub**:
   Ensure all changes are committed and pushed to the `main` branch:
   ```bash
   git add .
   git commit -m "feat: initial production-ready memorae release"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com).
   - Click **Add New...** -> **Project**.
   - Import your GitHub repository.

3. **Configure Environment Variables in Vercel**:
   Add the following secrets under **Settings > Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AI_PROVIDER` (`openai` or `nvidia`)
   - `OPENAI_API_KEY` (or `NVIDIA_API_KEY`)
   - `OPENAI_MODEL` (or `NVIDIA_MODEL`)
   - `NEXT_PUBLIC_APP_TIMEZONE` (`Asia/Kolkata`)
   - `CRON_SECRET`

4. **Setup Vercel Cron (Persistent Reminders)**:
   Add a `vercel.json` cron schedule to ping the reminder worker every minute:
   ```json
   {
     "crons": [
       {
         "path": "/api/reminders/process",
         "schedule": "* * * * *"
       }
     ]
   }
   ```

5. **Deploy**:
   Click **Deploy**. Once built, the application is live with automated CI/CD for all future updates.
