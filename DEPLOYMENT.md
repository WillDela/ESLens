# ESLens - Deployment & Demo Guide

## 🚀 Quick Deployment Checklist

### Pre-Deployment (Do this first!)

- [ ] Get Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] Add API key to `.env` file
- [ ] Test backend locally
- [ ] Test frontend locally
- [ ] Prepare demo video script
- [ ] Find 2-3 sample homework images

---

## 💻 Local Development & Testing

### Terminal 1: Backend Server

```bash
cd backend
npm install        # Only needed once
npm run dev       # Starts server on port 3001
```

You should see:
```
✅ Database initialized successfully
🚀 ESLens Backend Server running on port 3001
🔑 Gemini API: ✅ Configured
```

### Terminal 2: Frontend App

```bash
cd frontend
npm install       # Only needed once
npm start        # Starts React app on port 3000
```

Browser will open automatically at `http://localhost:3000`

---

## 🧪 Testing Checklist

### Backend API Tests

```bash
# In backend directory
node test-api.js
```

Should show:
- ✅ Health check passed
- ✅ Translation successful
- ✅ Homework upload successful (if test image provided)
- ✅ Chat response received

### Frontend Tests

1. **Upload Flow:**
   - [ ] Upload a homework image
   - [ ] See extracted text
   - [ ] See translation
   - [ ] Get tutor's greeting

2. **Chat Flow:**
   - [ ] Send message to tutor
   - [ ] Receive Socratic-method response (questions, not answers!)
   - [ ] Click "Speak" button (voice works)
   - [ ] View original homework context

3. **Language Selector:**
   - [ ] Change language
   - [ ] Upload new homework
   - [ ] Verify translation is in selected language

4. **History:**
   - [ ] View past sessions
   - [ ] Click on a session
   - [ ] Resume conversation

---

## 🌐 Production Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend) **[RECOMMENDED]**

#### Deploy Backend to Railway:

1. Push code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub"
4. Select your ESLens repo
5. Add environment variables:
   ```
   GEMINI_API_KEY=your_key_here
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
6. Deploy! Get the backend URL (e.g., `https://eslens-backend.railway.app`)

#### Deploy Frontend to Vercel:

1. Go to [Vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select GitHub repo
4. Set root directory to `frontend`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
6. Deploy!

#### Update frontend to use API URL:

Edit `frontend/package.json` and change proxy only for local dev:
```json
"proxy": process.env.REACT_APP_API_URL || "http://localhost:3001"
```

Or update API calls in components to use `process.env.REACT_APP_API_URL`.

---

### Option 2: Single Server (DigitalOcean/GoDaddy Hosting)

#### Setup on DigitalOcean Droplet:

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone your repo
git clone https://github.com/your-username/eslens.git
cd eslens

# Setup backend
cd backend
npm install
cp ../.env.example ../.env
nano ../.env  # Add your GEMINI_API_KEY

# Start backend with PM2
pm2 start server.js --name eslens-backend
pm2 save

# Setup frontend
cd ../frontend
npm install
npm run build

# Serve frontend with nginx
sudo apt-get install nginx
sudo cp build/* /var/www/html/

# Configure nginx proxy to backend
sudo nano /etc/nginx/sites-available/default
```

Nginx config:
```nginx
server {
    listen 80;
    server_name eslens.app www.eslens.app;

    location / {
        root /var/www/html;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

#### Setup GoDaddy Domain (eslens.app):

1. Go to GoDaddy DNS Management
2. Add A record: `@` → Your droplet IP
3. Add A record: `www` → Your droplet IP
4. Wait 10-30 minutes for DNS propagation

#### Add SSL Certificate (FREE):

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d eslens.app -d www.eslens.app
```

---

## 📹 Demo Video Guide (2 minutes)

### Script Structure:

**0:00-0:20 - The Problem**
```
Show: Stock footage or simple slides
Script: "Meet Maria, a 7th grader from Venezuela. She's struggling
with math homework - not because she can't do math, but because
it's in English. Her parents can't help. She can't afford a tutor.
What does she do?"
```

**0:20-0:40 - The Solution**
```
Show: ESLens landing page
Script: "Meet ESLens - Maria's AI homework buddy. She takes a photo
of her homework. ESLens translates it to Spanish. But instead of
giving her the answer..."
```

**0:40-1:20 - Live Demo**
```
Show: Screen recording of actual app
1. Upload homework image (math problem)
2. Show translation
3. Chat with tutor (demonstrate Socratic method)
   - Student: "I don't know how to start"
   - Tutor: "What are we trying to find here?"
   - Show 2-3 back-and-forth exchanges
4. Click "Speak" button
5. Show student arriving at answer
```

**1:20-1:40 - The Technology**
```
Show: Simple architecture diagram
Script: "Powered by Google Gemini AI:
• Vision AI extracts homework text
• Translation in 10+ languages
• Socratic tutoring that guides, never gives answers
• Voice synthesis for accessibility"
```

**1:40-2:00 - The Impact**
```
Show: Stats and closing
Script: "67% of Miami-Dade students are English learners -
that's 250,000+ students who could benefit from ESLens.

Every immigrant student deserves a fair shot at education.
ESLens breaks down language barriers - one homework problem at a time.

Built in 24 hours at SharkByte 2025."
```

### Recording Tools:

- **Screen Recording**: OBS Studio (free) or Loom
- **Video Editing**: DaVinci Resolve (free) or Canva
- **Voiceover**: Audacity (free) or just record with phone
- **Stock Footage**: Pexels.com or Unsplash.com (free)

---

## 📊 Hackathon Submission Checklist

### Devpost Submission:

- [ ] **Project Title**: ESLens - AI Tutoring for Immigrant Students
- [ ] **Tagline**: Breaking down language barriers in education, one homework problem at a time
- [ ] **Demo Video**: Upload 2-minute video
- [ ] **Screenshots**: 4-5 screenshots showing key features
- [ ] **Try it out link**: https://eslens.app (if deployed)
- [ ] **GitHub Repo**: Public repo link

### Technologies to List:

✅ **Google Gemini API** (Vision + Translation + Tutoring) - PRIMARY
- ElevenLabs (if implemented)
- Cloudflare AI (if implemented)
- GoDaddy (domain)
- DigitalOcean (hosting)
- React
- Node.js
- Express
- SQLite

### Challenges to Submit To:

1. ✅ **Best Use of Gemini API** (STRONGEST)
2. ✅ **Overall Prizes** (1st/2nd/3rd)
3. ✅ **Best Domain from GoDaddy** (if you register eslens.app)
4. Best Use of ElevenLabs (if implemented)
5. Best Use of Cloudflare AI (if implemented)

### Project Description Template:

```
## Inspiration
67% of Miami-Dade County students are English Language Learners. These students
often struggle not because they can't learn, but because they face language barriers.
We built ESLens to ensure every immigrant student has a fair shot at education.

## What it does
ESLens is a multi-agent AI tutoring system that:
1. Extracts homework text from photos using Gemini Vision
2. Translates to 10+ languages (Spanish, Creole, Portuguese, Vietnamese, etc.)
3. Tutors students using the Socratic method - guiding them to discover answers instead of giving them away
4. Provides voice synthesis for accessibility

## How we built it
- **Backend**: Node.js + Express with SQLite database
- **AI Agents**: Google Gemini 1.5 Pro for all AI capabilities (vision, translation, tutoring)
- **Frontend**: React web app with responsive design
- **Deployment**: Railway (backend) + Vercel (frontend) + GoDaddy domain

## Challenges we ran into
- Prompt engineering the Socratic method - ensuring the AI never gives direct answers
- Preserving mathematical notation during OCR and translation
- Balancing simplicity (for 24hr hackathon) with functionality

## Accomplishments
- Built a working end-to-end system in under 24 hours
- Sophisticated Socratic tutoring that truly guides instead of solves
- Support for 10+ languages with context-aware translation
- Clean, intuitive UI that immigrant students can actually use

## What we learned
- Google Gemini's versatility (vision, translation, conversation in one API!)
- The power of prompt engineering for educational applications
- How to build accessible AI tools for underserved communities

## What's next
- Mobile app (React Native)
- Progress tracking and learning analytics
- Teacher dashboard for monitoring
- Integration with school systems
- Expansion to more subjects beyond math
```

---

## 🎯 Key Talking Points for Judging

### For Gemini API Challenge:

1. **Multi-purpose use**: We use Gemini for THREE different agents:
   - Vision: Image → Text extraction
   - Translation: Context-aware multilingual translation
   - Tutoring: Complex conversational AI with Socratic method

2. **Sophisticated prompt engineering**: The tutoring prompt is carefully crafted to:
   - Never give direct answers
   - Adapt to student's understanding level
   - Use simple language for ESL students
   - Celebrate progress and handle frustration

3. **Real-world impact**: Serving 250,000+ English learners in Miami-Dade alone

### For Overall Prizes:

1. **Social impact**: Addressing real educational inequality
2. **Technical execution**: Full-stack app with multi-agent architecture
3. **Innovation**: Socratic method AI that guides, never solves
4. **Completeness**: Working demo with backend, frontend, and deployment

---

## 🐛 Common Issues & Fixes

### Backend won't start:
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001
# Kill process if needed
taskkill /PID <process_id> /F
```

### Gemini API errors:
- Check API key is correct in `.env`
- Verify key has no extra spaces
- Check API quota at https://makersuite.google.com

### Frontend can't reach backend:
- Make sure backend is running first
- Check proxy setting in `package.json`
- Look for CORS errors in browser console

### Image upload fails:
- Check image size (<10MB)
- Verify image format (JPG, PNG, GIF)
- Check uploads directory exists and has write permissions

---

## ✅ Final Pre-Demo Checklist

1 Hour Before Demo:
- [ ] Backend running smoothly
- [ ] Frontend loads correctly
- [ ] Test with 2-3 homework images
- [ ] Verify Socratic method works (no direct answers)
- [ ] Test voice synthesis
- [ ] Clear old test data from database
- [ ] Have backup screenshots/video ready

Good luck at SharkByte 2025! 🦈🚀
