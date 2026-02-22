# Social Saver Bot - Full Stack Architecture

This document describes the architecture of the Social Saver Bot system.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User (WhatsApp)                           │
└──────────────────────────────┬──────────────────────────────────┘
                               │ (sends link)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Twilio WhatsApp                             │
│                    (Message Handler)                             │
└──────────────────────────────┬──────────────────────────────────┘
                               │ (POST /webhook)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  WhatsApp Route (/api/whatsapp/webhook)                 │  │
│  │    → Extract URL from message                           │  │
│  │    → URL Extractor (detect platform)                    │  │
│  │    → AI Processor (categorize & summarize)              │  │
│  │    → Save to Database                                   │  │
│  │    → Send WhatsApp response                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Content Routes (/api/content/*)                         │  │
│  │    → CRUD operations                                     │  │
│  │    → Search & filter                                     │  │
│  │    → Get categories & platforms                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
         │                      │
         ▼                      ▼
    ┌─────────────┐     ┌───────────────────────┐
    │  SQLite DB  │     │ Hugging Face Inference│
    │  (Saves)    │     │      API (AI Tasks)   │
    └─────────────┘     └───────────────────────┘
         │
         └──────────────────────┬──────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   React Dashboard     │
                    │  (Vite + React)       │
                    │  Localhost:3000       │
                    │                       │
                    │ • View saved content  │
                    │ • Search & filter     │
                    │ • Archive items       │
                    │ • View links          │
                    └───────────────────────┘
```

## Components

### Backend (Python/FastAPI)

**Location:** `/backend`

- **main.py** - FastAPI application entry point
- **config.py** - Environment configuration
- **database/** - Database initialization
- **app/models/**
  - `database.py` - SQLAlchemy ORM models
  - `schemas.py` - Pydantic validation schemas
- **app/routes/**
  - `whatsapp.py` - WhatsApp webhook endpoint
  - `content.py` - CRUD endpoints for saved content
  - `health.py` - Health check endpoints
- **app/services/**
  - `content_service.py` - Content business logic
  - `whatsapp_service.py` - WhatsApp & Twilio integration
- **app/utils/**
  - `url_extractor.py` - Extract data from URLs
- `ai_processor.py` - Hugging Face integration for categorization/summarization

### Frontend (React/Vite)

**Location:** `/frontend`

- **src/App.jsx** - Main application component
- **src/main.jsx** - React entry point
- **src/index.css** - Tailwind CSS styling
- **src/components/**
  - `Layout.jsx` - Header & Footer
  - `SearchBar.jsx` - Search & filter UI
  - `ContentCard.jsx` - Display saved content
  - `SetupGuide.jsx` - Setup instructions component
  - `Toast.jsx` - Notification system
- **src/pages/**
  - `Dashboard.jsx` - Main dashboard page
  - `Setup.jsx` - Setup instructions page
- **src/utils/**
  - `api.js` - Axios API client
  - `helpers.js` - Utility functions

### Database

**Type:** SQLite (local) / Can be switched to PostgreSQL/MongoDB

**Table:** `saved_content`
- id (primary key)
- user_id (identifies WhatsApp user)
- platform (instagram, twitter, blog)
- original_url (link to content)
- caption (original post caption)
- title (article title)
- category (AI-generated category)
- summary (AI-generated 1-sentence summary)
- hashtags (comma-separated)
- thumbnail_url (image from content)
- is_archived (soft delete flag)
- created_at / updated_at (timestamps)

## Data Flow

### When User Sends a Link to WhatsApp Bot:

1. **User sends:** `"Check this out: https://instagram.com/p/xyz..."`
2. **Twilio receives** message and POSTs to `/api/whatsapp/webhook`
3. **Backend processes:**
   - Extracts URL: `https://instagram.com/p/xyz...`
   - Identifies platform: `instagram`
   - Extracts metadata (caption, hashtags, thumbnail)
   - Sends to Hugging Face to get category and summary
   - Saves to database
4. **Bot replies:** `"✨ Saved to your knowledge base! Category: Fitness. Summary: Great abs workout..."`
5. **Frontend displays:** New card appears in user's dashboard

### When User Searches Dashboard:

1. **User types:** "pasta recipes" and clicks search
2. **Frontend sends:** `GET /api/content/user_123/search?q=pasta`
3. **Backend queries** database for matches in caption, title, summary, hashtags
4. **Results return** and are displayed in grid
5. **User can** click to open original link, copy URL, or archive

## Key Features

### 1. Platform Support
- **Instagram:** Extract post ID, caption, hashtags, thumbnail
- **Twitter/X:** Extract tweet ID, text content
- **Blogs:** Scrape title, description, og:image

### 2. AI Intelligence
- **Categorization:** 11 categories (Fitness, Coding, Food, Travel, Design, Business, Education, Entertainment, Health, Productivity, Other)
- **Summarization:** 1-sentence summaries of content
- **Confidence:** Uses Falcon 7B Instruct via Hugging Face for fast, affordable processing

### 3. Search & Discovery
- Full-text search across caption, title, summary, hashtags
- Filter by category and platform
- Sort by date (newest first)
- Quick access to open original content

### 4. User Experience
- No app installation needed (WhatsApp)
- Automatic categorization (no manual tagging)
- Clean, modern dashboard
- Mobile-responsive design

## Technical Stack

| Component | Technology |
|-----------|-----------|
| Backend | Python, FastAPI, SQLAlchemy |
| Frontend | React 18, Vite, Tailwind CSS |
| WhatsApp | Twilio API (Sandbox) |
| AI | Hugging Face Inference API (Falcon 7B Instruct) |
| Database | SQLite (development) / PostgreSQL (production) |
| HTTP | REST API |
| Real-time | No (async processing) |

## Deployment Considerations

1. **Backend:** Deploy to Heroku, Railway, or AWS
2. **Frontend:** Deploy to Vercel, Netlify, or GitHub Pages
3. **Database:** Use PostgreSQL on production (switch ENGINE in config.py)
4. **Secrets:** Use environment variables, never commit .env
5. **SSL/TLS:** Required for WhatsApp webhook (production only)

## Extensibility Points

1. **Add platforms:** Extend `URLExtractor` class with new methods
2. **Change AI model:** Swap the Hugging Face model endpoint in `AIProcessor`
3. **Custom categories:** Modify `CATEGORIES` list in `AIProcessor`
4. **Database:** Switch to MongoDB/Firestore by changing database engine
5. **UI:** Add export to PDF, sharing, collaboration features
