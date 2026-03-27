# CampusAI Deployment Guide

## Prerequisites
- GitHub account
- Render account (for backend)
- Vercel account (for frontend)
- Supabase account (for database)

## Step 1: Push to GitHub

```bash
cd campusai
git init
git add .
git commit -m "CampusAI - Smart Campus Assistant"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/campusai.git
git push -u origin main
```

## Step 2: Setup Supabase

1. Create project at https://supabase.com
2. Go to SQL Editor and run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    doc_type TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    chunks_count INTEGER DEFAULT 0
);

CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(768),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON document_chunks USING ivfflat (embedding vector_cosine_ops);
```

3. Copy your Project URL and anon/public key

## Step 3: Deploy Backend to Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `GEMINI_API_KEY` = your Gemini API key
   - `SUPABASE_URL` = your Supabase URL
   - `SUPABASE_KEY` = your Supabase anon key
6. Deploy!

Copy your backend URL (e.g., `https://campusai-backend.onrender.com`)

## Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repo
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (keep default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://campusai-backend.onrender.com/api`
6. Deploy!

## Step 5: Add GitHub Secrets

In your GitHub repo, go to Settings → Secrets and add:

| Secret Name | Value |
|-------------|-------|
| `RENDER_DEPLOY_TOKEN` | From Render dashboard |
| `VERCEL_TOKEN` | From Vercel account settings |
| `VERCEL_ORG_ID` | From Vercel project settings |
| `VERCEL_PROJECT_ID` | From Vercel project settings |

## Step 6: Get Google Gemini API Key

1. Go to https://aistudio.google.com
2. Create API key
3. Add to Render environment variables

## Quick Local Development

```bash
# Backend
cd backend
cp .env.example .env  # Add your keys
uvicorn main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Features Checklist

- [x] Smart Q&A Chatbot
- [x] Assignment Helper
- [x] Study Planner
- [x] Resume Builder
- [x] Career Guidance
- [x] Admin Dashboard (Document Upload)
- [x] RAG Knowledge Base
- [x] GitHub Actions CI/CD
- [x] Vercel Deployment Config
- [x] Render Deployment Config
