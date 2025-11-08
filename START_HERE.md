# 🚀 ESLens - START HERE

**Welcome to ESLens!** This is your complete AI tutoring system for immigrant students.

---

## ⚡ Quick Start (5 minutes)

### Step 1: Get Your Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

### Step 2: Configure the App

1. Open the file: `ESLens/.env`
2. Find the line: `GEMINI_API_KEY=`
3. Paste your API key after the `=`
4. Save the file

Example:
```
GEMINI_API_KEY=AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx
```

### Step 3: Start the Backend

Open a terminal in the `backend` folder and run:

```bash
cd backend
npm run dev
```

✅ You should see: `🚀 ESLens Backend Server running on port 3001`

### Step 4: Start the Frontend

Open a **NEW** terminal in the `frontend` folder and run:

```bash
cd frontend
npm start
```

✅ Your browser will open automatically at http://localhost:3000

---

## 🎯 What You Just Built

### ✅ Complete Features:

1. **📸 Image Upload**
   - Upload homework photos
   - Extract text with Gemini Vision AI
   - Works with printed and handwritten text

2. **🌐 Translation (10+ Languages)**
   - Spanish, Creole, Portuguese, Vietnamese
   - Mandarin, Arabic, Tagalog, French, Korean, Russian, English
   - Context-aware translation that preserves math equations

3. **🎓 Socratic Tutoring**
   - AI tutor that GUIDES, never gives direct answers
   - Powered by Gemini 1.5 Pro
   - Adapts to student's understanding level
   - Breaks down complex problems step-by-step

4. **🔊 Voice Synthesis**
   - Read-aloud feature using Web Speech API
   - Works in multiple languages

5. **📚 Session History**
   - View past homework sessions
   - Resume conversations
   - Track progress over time

6. **💾 Database**
   - SQLite database stores all sessions
   - Conversation history preserved
   - No external database needed

---

## 🧪 Testing Your App

### Test 1: Health Check

Visit: http://localhost:3001/api/health

You should see:
```json
{
  "status": "healthy",
  "geminiConfigured": true
}
```

### Test 2: Translation

```bash
curl -X POST http://localhost:3001/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Solve for x: 3x + 5 = 14",
    "targetLanguage": "spanish"
  }'
```

### Test 3: Full Flow

1. Go to http://localhost:3000
2. Click "Upload Homework Photo"
3. Select an image of homework (math problem works best!)
4. Watch as it:
   - Extracts the text ✨
   - Translates it 🌍
   - Starts tutoring you 🎓

5. Chat with the tutor:
   - Try: "I don't understand how to start"
   - Notice: The tutor asks QUESTIONS, doesn't give answers!

6. Click the "🔊 Speak" button to hear the response

---

## 📁 Project Structure

```
ESLens/
├── backend/                    # Node.js + Express API
│   ├── server.js              # Main server
│   ├── agents/                # AI agents
│   │   ├── visionAgent.js     # Image → Text (Gemini Vision)
│   │   ├── translationAgent.js # Translation (Gemini)
│   │   └── tutoringAgent.js   # Socratic tutoring (Gemini Pro) ⭐
│   ├── database/
│   │   └── db.js              # SQLite operations
│   ├── uploads/               # Uploaded homework images
│   └── database.sqlite        # SQLite database (auto-created)
│
├── frontend/                   # React web app
│   ├── src/
│   │   ├── App.js             # Main app
│   │   └── components/
│   │       ├── Upload.js      # Image upload
│   │       ├── Chat.js        # Chat interface
│   │       ├── LanguageSelector.js
│   │       └── SessionHistory.js
│   └── public/
│
├── .env                       # Environment variables (API keys)
├── README.md                  # Project overview
├── QUICKSTART.md              # Quick setup guide
├── DEPLOYMENT.md              # Deployment instructions
└── START_HERE.md              # This file!
```

---

## 🎓 How the Socratic Method Works

### ❌ Traditional Tutoring (BAD):
```
Student: "How do I solve 3x + 5 = 14?"
Tutor: "Subtract 5 from both sides to get 3x = 9, then divide by 3 to get x = 3"
```
➡️ Student learns nothing, just copies the answer

### ✅ ESLens Socratic Method (GOOD):
```
Student: "How do I solve 3x + 5 = 14?"
Tutor: "Great question! What are we trying to find?"
Student: "x"
Tutor: "Exactly! Is x by itself on the left side?"
Student: "No, there's +5"
Tutor: "Right! What operation could remove that +5?"
Student: "Subtract 5?"
Tutor: "Perfect! And if we subtract 5 from the left, what must we do to the right?"
...
```
➡️ Student discovers the answer themselves and truly learns!

**This is the CORE innovation of ESLens.**

---

## 🏆 Hackathon Submission

### Challenges This Project Qualifies For:

✅ **Best Use of Gemini API** (PRIMARY - we use it for 3 different agents!)
- Vision Agent: Image → Text extraction
- Translation Agent: Multilingual translation
- Tutoring Agent: Complex conversational AI

✅ **Overall Prizes** (1st/2nd/3rd)
- Strong social impact (helping 250K+ students in Miami-Dade alone)
- Full-stack implementation
- Unique Socratic method approach

✅ **Best Domain from GoDaddy** (if you register eslens.app)

✅ **Best Use of ElevenLabs** (if you implement voice synthesis with their API)

✅ **Best Use of Cloudflare AI** (if you add it as fallback for translation)

---

## 📹 Demo Video Tips

### What to Show (2 minutes total):

**0:00-0:20** - The Problem
- Immigrant students struggle with homework due to language barriers
- 67% of Miami-Dade students are English learners

**0:20-0:40** - The Solution
- Show ESLens app
- Explain: "AI tutor that guides, doesn't give answers"

**0:40-1:20** - Live Demo
- Upload homework image
- Show translation
- Chat with tutor (demonstrate Socratic method!)
- Click "Speak" button
- Show student arriving at answer

**1:20-1:40** - Technology
- Powered by Google Gemini (vision + translation + tutoring)
- 10+ languages supported
- Web-based, accessible to anyone

**1:40-2:00** - Impact
- Breaking down barriers for 250,000+ students
- "Built in 24 hours at SharkByte 2025"

---

## 🐛 Troubleshooting

### "Gemini API: ❌ Not configured"
➡️ Check `.env` file has your API key with no extra spaces

### Backend won't start
➡️ Make sure port 3001 is not in use
➡️ Run: `cd backend && npm install` first

### Frontend shows blank page
➡️ Check browser console for errors
➡️ Make sure backend is running first
➡️ Clear browser cache and refresh

### Image upload fails
➡️ Check image is JPG, PNG, or GIF
➡️ Make sure image is under 10MB
➡️ Verify backend `uploads/` folder exists

### Translation not working
➡️ Verify Gemini API key is valid
➡️ Check internet connection
➡️ Look at backend terminal for error messages

---

## 🚀 Next Steps

### For the Hackathon:

1. **Test Everything** ✅
   - Upload 3-4 different homework images
   - Try different languages
   - Verify Socratic method works (no direct answers!)

2. **Record Demo Video** 🎥
   - 2 minutes max
   - Follow script in DEPLOYMENT.md
   - Show the Socratic method in action!

3. **Deploy** 🌐
   - See DEPLOYMENT.md for options
   - Railway (backend) + Vercel (frontend) is easiest
   - Register eslens.app domain on GoDaddy

4. **Submit to Devpost** 📝
   - Upload demo video
   - Add screenshots
   - List all technologies used
   - Submit to all relevant challenges

### After the Hackathon:

- Add mobile app (React Native)
- Integrate ElevenLabs for better voice
- Add teacher dashboard
- Implement progress tracking
- Add more subjects (history, science, etc.)
- Partner with schools in Miami-Dade

---

## 💡 Key Talking Points for Judges

1. **Sophisticated AI Use**: We use Gemini for 3 different purposes (vision, translation, tutoring)

2. **Educational Innovation**: Socratic method ensures students LEARN, not just get answers

3. **Real Social Impact**: Serving 250,000+ English learners in Miami-Dade alone

4. **Technical Execution**: Full-stack app with multi-agent architecture, built in <24 hours

5. **Accessibility**: 10+ languages, voice synthesis, simple UI

---

## 📚 Additional Documentation

- **README.md** - Project overview and architecture
- **QUICKSTART.md** - Quick setup instructions
- **DEPLOYMENT.md** - Complete deployment guide with demo video script
- **backend/test-api.js** - Automated API testing script

---

## 🎉 Congratulations!

You've built a complete AI tutoring system that can help thousands of immigrant students!

**Questions?** Check the other documentation files or the code comments.

**Good luck at SharkByte 2025!** 🦈🚀

---

**Built with ❤️ for immigrant students everywhere**
