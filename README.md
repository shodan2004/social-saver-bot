# Social Saver Bot 🚀

Turn your Instagram saves into a searchable knowledge base. Never lose that perfect workout routine or design inspiration again!

## What is Social Saver Bot?

A WhatsApp bot that:
- ✨ Accepts links from Instagram, Twitter, and blogs
- 🤖 Automatically categorizes and summarizes content using AI
- 📱 Stores everything in a beautiful, searchable dashboard
- 🔍 Lets you find content instantly with full-text search

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- Twilio account (free sandbox)
- Hugging Face API token

### Installation

1. **Clone and Setup Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
pip install -r requirements.txt
python main.py
```

2. **Setup Frontend:**
```bash
cd frontend
npm install
npm run dev
```

3. **Visit Dashboard:**
```
http://localhost:3000
```

## Configuration

### Environment Variables (.env)

```
# Twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Hugging Face
HF_API_TOKEN=hf_...

# Database
DATABASE_URL=sqlite:///./social_saver.db

# Server
HOST=0.0.0.0
PORT=8000
ENV=development
```

## API Endpoints

### WhatsApp
- `POST /api/whatsapp/webhook` - Receive messages from Twilio

### Content Management
- `GET /api/content/{user_id}/all` - Get all saved content
- `GET /api/content/{user_id}/search?q=query` - Search content
- `GET /api/content/{user_id}/filters/categories` - Get categories
- `POST /api/content/` - Create new content
- `DELETE /api/content/{user_id}/{content_id}` - Archive content

### Health
- `GET /api/health` - Health check
- `GET /api/` - API info

## Architecture

```
WhatsApp User
     ↓ (sends link)
  Twilio
     ↓ (webhook)
FastAPI Backend
  ├─ URL Extraction
  ├─ AI Processing
  ├─ Database Save
  └─ WhatsApp Reply
     ↓
React Dashboard (http://localhost:3000)
  ├─ View content
  ├─ Search
  └─ Organize
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed diagrams.

## Usage

### For Users:

1. **Save WhatsApp Bot Number** (Get from Twilio Sandbox)
2. **Forward an Instagram/Twitter link** to the bot
3. **Bot replies** with category and summary
4. **Open Dashboard** to see saved content
5. **Search anytime** for content you need

Example:
```
User: "Check this: https://instagram.com/reel/ABC123/"
Bot: "✨ Saved! Category: Fitness. Summary: 10-min abs workout..."
```

### In Dashboard:

- Browse all saved content in card format
- Search by keywords
- Filter by category or platform
- Click to open original content
- Archive items you don't need

## Features

### Supported Platforms
- 📸 **Instagram:** Reels, Posts, Stories (links)
- 𝕏 **Twitter/X:** Threads, regular tweets
- 📝 **Blogs:** Medium, Dev.to, Substack, etc.

### AI Features
- 🏷️ **Auto-Categorization:** 11 categories (Fitness, Coding, Food, Travel, Design, Business, Education, Entertainment, Health, Productivity, Other)
- 📄 **Summaries:** 1-sentence summaries of content
- 🔍 **Smart Search:** Full-text search across all fields
- ⏱️ **Quick Processing:** <2 seconds per link

### Dashboard Features
- 🎨 Beautiful card-based layout
- 🔎 Full-text search with filters
- 📱 Mobile responsive design
- 🏷️ Category and platform filtering
- 🔗 Copy links, open in new tab
- 📦 Archive old content

## Project Structure

```
HACK/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── database.py
│   │   │   └── schemas.py
│   │   ├── routes/
│   │   │   ├── whatsapp.py
│   │   │   ├── content.py
│   │   │   └── health.py
│   │   ├── services/
│   │   │   ├── content_service.py
│   │   │   └── whatsapp_service.py
│   │   └── utils/
│   │       ├── url_extractor.py
│   │       └── ai_processor.py
│   ├── main.py
│   ├── config.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── ARCHITECTURE.md
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Messaging | Twilio WhatsApp API |
| AI | Hugging Face Inference API (Falcon 7B Instruct) |
| Deployment | Docker (optional) |

## Development

### Backend Development
```bash
cd backend
# Install with dev dependencies
pip install -r requirements.txt

# Run with auto-reload
python main.py  # or use uvicorn main:app --reload

# Test an endpoint
curl http://localhost:8000/api/health
```

### Frontend Development
```bash
cd frontend
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Troubleshooting

### Backend won't start
```
# Check Python version
python --version  # Should be 3.9+

# Check dependencies
pip install -r requirements.txt

# Delete and reinitialize database
rm social_saver.db
```

### WhatsApp webhook not triggering
- Verify webhook URL in Twilio console
- Ensure backend is accessible (not on localhost only)
- Check environment variables are loaded
- Test with: `curl -X POST http://localhost:8000/api/whatsapp/webhook`

### Hugging Face API errors
- Verify token is valid
- Check quota limits
- Ensure account has credits
- Test API: `curl https://router.huggingface.co -H "Authorization: Bearer $HF_API_TOKEN"`

### Frontend won't load data
- Verify backend is running on http://localhost:8000
- Check browser console for CORS errors
- Try clearing browser cache
- Check that CORS_ORIGINS includes http://localhost:3000

## Performance Tips

1. **Database Indexing:** Indexes on user_id, created_at for faster queries
2. **Caching:** Can add Redis for frequently accessed content
3. **Image Optimization:** Compress thumbnails in production
4. **API Rate Limiting:** Add rate limits to prevent abuse
5. **Pagination:** Use skip/limit parameters for large result sets

## Security Considerations

1. 🔐 **Store secrets** in environment variables, never commit .env
2. 🔒 **Use HTTPS** in production (required for WhatsApp webhooks)
3. 🛡️ **Validate input** on all routes (Pydantic handles this)
4. 📊 **Rate limit** API endpoints to prevent abuse
5. 👤 **User isolation:** user_id in all queries prevents data leakage
6. 🗑️ **Soft delete:** Archive instead of hard deleting

## Hackathon Scoring

### Evaluation Criteria (as per challenge):
1. **WhatsApp → Instagram Flow (40%)**
   - ✅ Forward link to bot
   - ✅ Appears on website
   - ✅ Bot replies with summary

2. **AI Smarts (30%)**
   - ✅ Auto-categorization (11 categories)
   - ✅ Smart summarization
   - ✅ Hashtag extraction

3. **User Experience (20%)**
   - ✅ Clean dashboard
   - ✅ Full-text search
   - ✅ Mobile responsive
   - ✅ Easy navigation

4. **Wow Factor (10%)**
   - ✅ Link embedding support
   - 🎁 Potential: Random inspiration feature
   - 🎁 Potential: Sharing collections

## Future Enhancements

- 🎯 Support for more platforms (TikTok, Pinterest)
- 📊 Analytics dashboard (most saved categories, etc.)
- 🤝 Share collections with friends
- 📧 Email digest of saved content
- 🎨 Custom themes and layouts
- 🔔 Notifications for new similar content
- 📱 Mobile app (React Native)
- 🌐 Deployment to production (Heroku, Railway, Vercel)

## Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## License

MIT License - feel free to use for hackathons and learning!

## Support

- 📖 [Read Architecture Guide](ARCHITECTURE.md)
- 💬 [Open an issue](https://github.com/yourusername/social-saver-bot/issues)
- 📧 Email support available

---

**Made with ❤️ for the Hackathon**

Give us a ⭐ if this helped you!
