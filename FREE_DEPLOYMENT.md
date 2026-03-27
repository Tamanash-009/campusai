# CampusAI Deployment Guide - 100% FREE

## Free Services Used
- **Frontend**: Vercel (free)
- **Backend**: Render (free tier + UptimeRobot)
- **Database**: Supabase (free tier)
- **AI**: Google Gemini (free tier)
- **Code Hosting**: GitHub (free)

---

## Step 1: Get All Free API Keys

### 1.1 Google Gemini API (FREE)
1. Go to: https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key (starts with AIza...)
4. **Cost: FREE forever** (15 requests/min, 1.5M tokens/month)

### 1.2 Supabase (FREE)
1. Go to: https://supabase.com
2. Sign up (free)
3. Create new project
4. Go to Settings → API
5. Copy:
   - Project URL
   - anon/public key
6. **Cost: FREE** (500MB database, 1GB storage)

### 1.3 GitHub (FREE)
1. Go to: https://github.com
2. Sign up (free)
3. Your code is already pushed to: https://github.com/Tamanash-009/campusai

---

## Step 2: Setup Supabase Database

1. Go to your Supabase project → **SQL Editor**
2. Run this query to enable pgvector:

```sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    doc_type TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    chunks_count INTEGER DEFAULT 0
);

-- Document chunks for RAG
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(768),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vector search index
CREATE INDEX ON document_chunks USING ivfflat (embedding vector_cosine_ops);

-- Match documents function
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding VECTOR(768),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 5
)
RETURNS TABLE(content TEXT, metadata JSONB, similarity FLOAT)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.content,
        dc.metadata,
        1 - (dc.embedding <=> query_embedding) AS similarity
    FROM document_chunks dc
    WHERE 1 - (dc.embedding <=> query_embedding) > match_threshold
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
```

---

## Step 3: Deploy Backend to Render (FREE)

1. Go to: https://render.com
2. Sign up with GitHub (free)
3. Click **"New +"** → **"Blueprint"**
4. Connect your GitHub repo: `Tamanash-009/campusai`
5. Click **"Apply"**
6. Render will auto-detect `render.yaml`

### Add Environment Variables in Render:
| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Your Gemini API key |
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_KEY` | Your Supabase anon key |

7. Click **"Create Blueprint"**
8. Wait for deployment (2-5 minutes)

**Copy your backend URL:** (e.g., `https://campusai-backend.onrender.com`)

---

## Step 4: Keep Backend Awake (FREE)

Render's free tier sleeps after 15 minutes. Fix this:

1. Go to: https://uptimerobot.com
2. Sign up (free)
3. Click **"Add New Monitor"**
4. Configure:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: CampusAI Backend
   - **URL**: Your Render backend URL (e.g., `https://campusai-backend.onrender.com`)
   - **Monitoring Interval**: 5 minutes
5. Click **"Create Monitor"**

**Now your backend stays awake 24/7 for FREE!**

---

## Step 5: Deploy Frontend to Vercel (FREE)

1. Go to: https://vercel.com
2. Sign up with GitHub (free)
3. Click **"Add New..."** → **"Project"**
4. Import: `Tamanash-009/campusai`
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`
6. Add Environment Variable:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | Your Render URL + `/api` |

   Example: `https://campusai-backend.onrender.com/api`

7. Click **"Deploy"**

**Copy your frontend URL:** (e.g., `https://campusai.vercel.app`)

---

## Step 6: Update GitHub Secrets (For Auto-Deploy)

1. Go to: https://github.com/Tamanash-009/campusai/settings/secrets/actions
2. Add these secrets:

| Secret Name | Where to Get |
|------------|--------------|
| `RENDER_DEPLOY_TOKEN` | Render.com → Account Settings → API Keys |
| `VERCEL_TOKEN` | Vercel.com → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel project settings |
| `VERCEL_PROJECT_ID` | Vercel project settings |

---

## Cost Summary

| Service | Monthly Cost | Forever? |
|---------|--------------|----------|
| Gemini API | $0 | ✅ Yes |
| Supabase | $0 | ✅ Yes (500MB) |
| Vercel | $0 | ✅ Yes |
| Render | $0 | ✅ Yes (sleeps) |
| UptimeRobot | $0 | ✅ Yes |
| GitHub | $0 | ✅ Yes |

**Total: $0/month forever!**

---

## Testing Your Deployment

1. Visit your Vercel URL (frontend)
2. Test the chat - it should work!
3. If errors, check:
   - Backend is awake (visit Render URL directly)
   - VITE_API_URL is correct
   - All env vars are set

---

## Troubleshooting

### Backend shows "Application Error"
- Check logs in Render dashboard
- Verify GEMINI_API_KEY is correct
- Verify SUPABASE_URL and SUPABASE_KEY

### Chat not working
- Make sure backend URL is accessible
- Check browser console for CORS errors
- Verify VITE_API_URL ends with `/api`

### Database errors
- Run the SQL in Supabase SQL Editor
- Check SUPABASE_KEY is anon key, not service role
