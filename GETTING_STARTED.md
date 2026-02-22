# Getting Started Guide

## 🚀 Quick Start (5 minutes)

### 1. Clone and Install

```bash
# Backend setup
cd backend
pip install -r requirements.txt

# Frontend setup  
cd ../frontend
npm install
```

### 2. Get Credentials

- **Twilio:** Visit https://www.twilio.com/console
  - Create account (free with $20 credit)
  - Get Account SID, Auth Token
  - Set up WhatsApp Sandbox number
  
- **Hugging Face:** Visit https://huggingface.co/settings/tokens
  - Create an API token
  - Ensure account has credits

### 3. Configure Environment

**Backend (.env):**
```bash
cp backend/.env.example backend/.env
# Edit with your Twilio and Hugging Face credentials
```

**Frontend (optional):**
```bash
cp frontend/.env.example frontend/.env
# For production, set VITE_API_URL
```

### 4. Run Services

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
# Will run on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Will run on http://localhost:3000
```

### 5. Test It Out

1. Open http://localhost:3000 in browser
2. You should see your User ID (e.g., `user_abc123`)
3. Go to Twilio Dashboard → WhatsApp → Sandbox → Participants
4. Add yourself as a participant (if not already)
5. Open WhatsApp and send a message to your bot number
6. Forward an Instagram link and watch it appear in dashboard!

## 📋 What to Test

### Quick Test Checklist

- [ ] Backend starts without errors
- [ ] Frontend dashboard loads
- [ ] User ID is displayed
- [ ] Hugging Face API token works (check logs)
- [ ] Twilio credentials are set
- [ ] Can send WhatsApp message to bot number
- [ ] Bot replies with confirmation
- [ ] Content appears in dashboard
- [ ] Can search saved content
- [ ] Can archive items

## 💡 Example Workflow

```
1. You: "Check this out: https://instagram.com/p/C3QqwK87hZ/"
   ↓
2. Bot: "🤔 Processing..."
   ↓
3. Backend: Extracts caption, generates category, creates summary
   ↓
4. Bot: "✨ Saved! Category: Fitness. Summary: 15-minute home workout routine..."
   ↓
5. You: Open dashboard and see new card
   ↓
6. You: Search "workout" and find it instantly
```

## 🛠️ Common Tasks

### Add Support for New Platform

Edit `backend/app/utils/url_extractor.py`:

```python
@staticmethod
def extract_tiktok_data(url: str) -> Dict:
    """Extract data from TikTok link."""
    # Implementation here
```

### Change AI Model

Edit `backend/app/utils/ai_processor.py`:

```python
# Change model endpoint
self.api_url = "https://router.huggingface.co/hf-inference/models/tiiuae/falcon-7b-instruct"
```

### Export Data

Add endpoint in `backend/app/routes/content.py`:

```python
@router.get("/{user_id}/export")
async def export_content(user_id: str):
    # Return as CSV/JSON
```

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check Python version (need 3.9+)
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Delete old database
rm backend/social_saver.db

# Try again
python backend/main.py
```

### Frontend not loading
```bash
# Check Node version (need 16+)
node --version

# Clear cache
rm -rf frontend/node_modules
npm install --legacy-peer-deps

# Start again
npm run dev
```

### WhatsApp not receiving messages
1. Log in to Twilio Console
2. Go to WhatsApp → Sandbox
3. Verify you joined the sandbox
4. Check message history in console
5. Make sure webhook URL is correct

### Hugging Face API timeout
1. Check internet connection
2. Verify API token is valid
3. Check API usage/quota in your Hugging Face account
4. Try a lighter model endpoint for lower latency

## 📚 Next Steps

1. **Read Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)
2. **Deploy to Production:** [DEPLOYMENT.md](DEPLOYMENT.md)
3. **Extend Features:** Add more platforms, export functionality, etc.
4. **Optimize Performance:** Add caching, database indexes
5. **Monitor:** Set up error tracking with Sentry

## 🎯 Hackathon Tips

### For Demo
1. Pre-populate some test content in database
2. Have a clean UI screenshot ready
3. Practice the flow (message → bot → dashboard)
4. Have backup links ready in case WhatsApp is slow

### For Score
```
✅ 40% - WhatsApp Integration     (Core feature - DONE)
✅ 30% - AI Categorization        (Works with HF inference - DONE)
✅ 20% - Dashboard UX              (Clean, responsive - DONE)
✅ 10% - Wow Factor                (Search, filters, smooth UX)

🎁 Bonus Ideas:
   - Embed video player
   - Share collections
   - Email digest
   - Analytics dashboard
   - Random inspiration button
```

## 🔗 Useful Links

- **Twilio Docs:** https://www.twilio.com/docs/whatsapp
- **Hugging Face Inference:** https://huggingface.co/docs/inference-providers/index
- **FastAPI:** https://fastapi.tiangolo.com
- **React:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com

## 📞 Getting Help

1. Check logs: `python main.py` shows error details
2. Check browser console: F12 → Console tab
3. Read ARCHITECTURE.md for system overview
4. Search GitHub issues for similar problems
5. Ask in Discord/Slack channels

---

**You're all set! Happy hacking! 🚀**
