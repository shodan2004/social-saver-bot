name: '📋 Social Saver Bot Setup'
description: 'Project setup and configuration checklist'

- [ ] **Backend Setup**
  - [ ] Copy `backend/.env.example` to `backend/.env`
  - [ ] Fill in Twilio credentials
  - [ ] Fill in OpenAI API key
  - [ ] Run `pip install -r requirements.txt`
  - [ ] Start with `python main.py`

- [ ] **Frontend Setup**
  - [ ] Run `npm install` in frontend/
  - [ ] Run `npm run dev`
  - [ ] Verify dashboard loads at http://localhost:3000

- [ ] **Twilio Configuration**
  - [ ] Create Twilio account
  - [ ] Get WhatsApp Sandbox credentials
  - [ ] Set webhook URL: `http://localhost:8000/api/whatsapp/webhook`
  - [ ] Test send message to bot

- [ ] **OpenAI Configuration**
  - [ ] Get OpenAI API key
  - [ ] Add to .env file
  - [ ] Test categorization in dashboard

- [ ] **Testing**
  - [ ] Send Instagram link to bot
  - [ ] Verify appears in dashboard
  - [ ] Check categorization is correct
  - [ ] Test search functionality

- [ ] **Deployment (Optional)**
  - [ ] Choose hosting (Heroku, Railway, Vercel)
  - [ ] Deploy backend
  - [ ] Deploy frontend
  - [ ] Update webhook URL
  - [ ] Test in production
