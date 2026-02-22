# Deployment Guide

## Single Server Deployment (Recommended for Hackathon)

### Using Railway.app (Easiest)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Select this repository
   - Choose `/backend` directory (if prompted)
   - Add environment variables from `.env`
   - Railway auto-detects Flask/FastAPI
   - Deployment takes ~2 minutes

3. **Deploy Frontend**
   - Create new project
   - Select repository
   - Choose `/frontend` directory
   - Add environment variable: `VITE_API_URL=https://your-backend-url.railway.app`
   - Frontend auto-detects Node.js/Vite

4. **Update Twilio Webhook**
   - Go to Twilio Dashboard
   - Set Webhook URL: `https://your-backend-url.railway.app/api/whatsapp/webhook`

### Using Heroku (Classic)

**Backend:**
```bash
# Create Procfile in backend/
web: gunicorn -w 4 -b 0.0.0.0:$PORT main:app

# Install gunicorn
pip install gunicorn

# Create requirements.txt update
echo "gunicorn==21.2.0" >> requirements.txt

# Deploy
heroku create my-social-saver-backend
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main

# Set environment variables
heroku config:set TWILIO_ACCOUNT_SID=xxx
heroku config:set TWILIO_AUTH_TOKEN=xxx
heroku config:set HF_API_TOKEN=xxx
```

**Frontend:**
```bash
# Frontend to Vercel
npm install -g vercel
vercel

# When prompted, set:
# Build Command: npm run build
# Output Directory: dist
# Environment Variable: VITE_API_URL=https://your-backend.herokuapp.com
```

## Docker Deployment

Create `Dockerfile` for backend:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create `docker-compose.yml` for local testing:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/social_saver
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - TWILIO_PHONE_NUMBER=${TWILIO_PHONE_NUMBER}
      - HF_API_TOKEN=${HF_API_TOKEN}

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=social_saver
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Production Checklist

- [ ] Update `DEBUG=False` in production
- [ ] Generate strong `SECRET_KEY`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS/SSL
- [ ] Set up CORS properly
- [ ] Add rate limiting to API
- [ ] Enable database backups
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CDN for frontend assets
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add logging and monitoring
- [ ] Test WhatsApp webhook in production
- [ ] Document deployment process

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Backend to Railway
        run: |
          # Railway CLI deployment
          npx @railway/cli@latest up --service backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
      
      - name: Deploy Frontend to Vercel
        run: |
          npx vercel --prod --frontend
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## Scaling Tips

1. **Database:** Use managed PostgreSQL (AWS RDS, Railway PostgreSQL)
2. **Caching:** Add Redis for frequently cached data
3. **API Rate Limiting:** Use FastAPI's rate limiting middleware
4. **Load Balancing:** Use Railway's built-in load balancing
5. **CDN:** Use Cloudflare for frontend assets
6. **Monitoring:** Set up Sentry for error tracking

## Cost Estimation

For low-scale hackathon usage:

| Service | Cost | Notes |
|---------|------|-------|
| Railway (Backend) | $5/month | Includes 5GB of compute |
| Vercel (Frontend) | $0 | Free tier sufficient |
| Twilio (WhatsApp) | $0 | Sandbox free |
| Hugging Face API | ~$1-5 | Pay-as-you-go |
| **Total** | ~$5-10/month | Very affordable |

## Troubleshooting Deployments

**Backend crashes on startup:**
- Check logs: `railway logs` or `heroku logs --tail`
- Verify all environment variables are set
- Ensure database is initialized

**Frontend can't reach backend:**
- Check CORS settings in backend
- Verify `VITE_API_URL` is correct
- Test API directly: `curl https://backend-url/api/health`

**WhatsApp webhook timeouts:**
- Backend response takes too long
- Optimize database queries
- Add request timeout handling
- Process links asynchronously with Celery

**Database connection errors:**
- Verify DATABASE_URL is correct
- Check database is running
- Review PostgreSQL connection limits

## What's Next?

1. **Automate with GitHub Actions**
2. **Add automated testing (pytest, vitest)**
3. **Set up logging and monitoring**
4. **Add feature flags for rollouts**
5. **Setup staging environment**
