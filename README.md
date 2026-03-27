# CampusAI - Smart Campus Assistant

AI-powered assistant for Brainware University students.

## Features

- **Smart Q&A Chatbot** - Ask about timetables, exams, syllabus, fees, events
- **Assignment Helper** - Get step-by-step guidance without direct answers
- **Study Planner** - Personalized day-by-day study schedules
- **Resume Builder** - Professional resume generation with ATS optimization
- **Career Guidance** - Career paths, certifications, and roadmaps
- **Admin Dashboard** - Upload documents for RAG knowledge base

## Tech Stack

- **Frontend**: React.js + Tailwind CSS + Vite + Lucide Icons
- **Backend**: Python FastAPI + Uvicorn
- **AI**: Google Gemini API (gemini-1.5-flash)
- **Database**: Supabase (PostgreSQL + pgvector)
- **Deployment**: Vercel (frontend) + Render (backend)
- **CI/CD**: GitHub Actions

## Project Structure

```
campusai/
├── backend/                    # FastAPI backend
│   ├── main.py                # API entry point
│   ├── config.py             # Environment settings
│   ├── models/
│   │   └── schemas.py        # Pydantic models
│   ├── routes/
│   │   ├── chat.py          # /api/chat - Chatbot endpoint
│   │   ├── assignment.py    # /api/assignment - Assignment helper
│   │   ├── study_plan.py    # /api/study-plan - Study planner
│   │   ├── resume.py        # /api/resume - Resume builder
│   │   ├── career.py        # /api/career - Career guidance
│   │   ├── documents.py     # /api/upload, /api/documents
│   │   └── admin.py         # /api/analytics
│   └── services/
│       ├── gemini.py        # Gemini API integration
│       ├── rag.py           # Document processing & embeddings
│       ├── database.py      # Supabase integration
│       ├── assignment.py    # Assignment helper logic
│       ├── study_planner.py # Study plan generation
│       ├── resume_builder.py# Resume generation
│       └── career.py        # Career guidance logic
├── frontend/                  # React app
│   ├── src/
│   │   ├── App.jsx         # Main app with routing
│   │   ├── components/
│   │   │   └── Layout.jsx  # Navigation layout
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx
│   │   │   ├── AssignmentPage.jsx
│   │   │   ├── StudyPlannerPage.jsx
│   │   │   ├── ResumePage.jsx
│   │   │   ├── CareerPage.jsx
│   │   │   └── AdminPage.jsx
│   │   └── utils/
│   │       └── api.js      # API client
│   ├── vite.config.js      # Vite + proxy config
│   └── tailwind.config.js # Tailwind CSS config
├── .github/
│   └── workflows/
│       ├── ci.yml          # CI pipeline
│       ├── backend-deploy.yml
│       └── frontend-deploy.yml
├── render.yaml             # Render deployment config
├── DEPLOYMENT.md          # Detailed deployment guide
└── README.md              # This file
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to chatbot |
| POST | `/api/chat/stream` | Streaming chatbot response |
| POST | `/api/assignment` | Get assignment guidance |
| POST | `/api/study-plan` | Generate study schedule |
| POST | `/api/study-plan/export` | Export as calendar link |
| POST | `/api/resume` | Generate professional resume |
| POST | `/api/career` | Get career guidance |
| POST | `/api/upload` | Upload PDF document |
| GET | `/api/documents` | List uploaded documents |
| DELETE | `/api/documents/{id}` | Delete a document |
| GET | `/api/analytics` | Get usage analytics |
| GET | `/api/usage` | Get usage statistics |

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)

```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
DATABASE_URL=postgresql://postgres:password@db...
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## License

MIT
