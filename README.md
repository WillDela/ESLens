# ESLens - AI Tutoring for Immigrant Students

**SharkByte 2025 Hackathon Project**

ESLens is a multi-agent AI tutoring system that helps immigrant students understand homework through camera-based scanning, multilingual translation, and Socratic tutoring.

## 🎯 Problem Statement

67% of Miami-Dade students are English Language Learners - over 250,000 students who struggle with homework not because they can't learn, but because of language barriers. ESLens breaks down these barriers.

## 🚀 Features

- **📸 Image-to-Text**: Upload homework photos, extract text with AI vision
- **🌐 Multilingual Translation**: Translate to 10+ languages (Spanish, Creole, Portuguese, Vietnamese, etc.)
- **🎓 Socratic Tutoring**: AI tutor that GUIDES students to answers instead of giving them away
- **🔊 Voice Synthesis**: Hear explanations in your native language
- **📊 Progress Tracking**: Track learning progress and subject mastery

## 🛠️ Technology Stack

### Backend
- **Node.js + Express**: API server
- **SQLite**: Fast, embedded database
- **Google Gemini 1.5 Pro**: Core AI for tutoring, vision, and translation
- **Multer**: Image upload handling

### Frontend (Coming Soon)
- **React**: Web interface
- **TailwindCSS**: Styling

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Setup

1. **Clone the repository**
```bash
cd Desktop/ESLens
```

2. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Start the backend server**
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 🧪 Testing the Backend

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Upload Homework Image (with curl)
```bash
curl -X POST http://localhost:3001/api/homework/upload \
  -F "image=@/path/to/your/homework.jpg" \
  -F "language=spanish"
```

### Continue Tutoring Chat
```bash
curl -X POST http://localhost:3001/api/tutor/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id-from-upload",
    "message": "I dont understand how to start"
  }'
```

### Get Session History
```bash
curl http://localhost:3001/api/tutor/history/your-session-id
```

## 📁 Project Structure

```
ESLens/
├── backend/
│   ├── server.js              # Main Express server
│   ├── agents/
│   │   ├── visionAgent.js     # Image → Text extraction
│   │   ├── translationAgent.js # Text translation
│   │   └── tutoringAgent.js   # Socratic tutoring (CORE)
│   ├── database/
│   │   └── db.js              # SQLite database operations
│   ├── uploads/               # Uploaded homework images
│   └── package.json
├── frontend/                  # React app (coming soon)
├── .env                       # Environment variables
└── README.md
```

## 🎓 How the Socratic Method Works

The tutoring agent **NEVER** gives direct answers. Instead:

❌ **Bad tutoring**: "The answer is x = 3"

✅ **Good tutoring**:
- "What are we trying to find?"
- "What operation could help us remove the +5?"
- "Why do you think that would work?"

Students learn by discovering answers themselves with guidance.

## 🏆 Hackathon Challenges Targeted

- ✅ **Best Use of Gemini API** (Vision + Tutoring + Translation)
- ✅ **Overall Prizes** (1st/2nd/3rd)
- ✅ **Best Use of ElevenLabs** (Voice synthesis - optional)
- ✅ **Best Use of Cloudflare AI** (Can integrate if time)
- ✅ **Best Domain from GoDaddy** (eslens.app)

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/homework/upload` | Upload homework image |
| POST | `/api/tutor/chat` | Send message to tutor |
| GET | `/api/tutor/history/:sessionId` | Get conversation history |
| GET | `/api/homework/sessions` | Get all sessions |
| POST | `/api/translate` | Standalone translation |

## 🌟 Core Innovation: Multi-Agent Architecture

ESLens uses **5 specialized AI agents**:

1. **Vision Agent**: Extracts text from images (Gemini Vision)
2. **Translation Agent**: Translates to native language (Gemini)
3. **Tutoring Agent**: Guides with Socratic method (Gemini Pro)
4. **Voice Agent**: Text-to-speech (ElevenLabs or Web Speech API)
5. **Learning Pattern Agent**: Tracks progress (Optional)

## 📝 Development Roadmap

### Phase 1: Backend ✅ (Current)
- [x] Express API setup
- [x] SQLite database
- [x] Vision Agent (image extraction)
- [x] Translation Agent
- [x] Tutoring Agent (Socratic method)
- [x] API endpoints

### Phase 2: Frontend (Next)
- [ ] React app setup
- [ ] Image upload UI
- [ ] Chat interface
- [ ] Language selector
- [ ] Voice playback

### Phase 3: Polish
- [ ] Voice synthesis (ElevenLabs)
- [ ] Progress dashboard
- [ ] Deploy to production
- [ ] Demo video

## 🤝 Contributing

This is a hackathon project built in <24 hours. Contributions welcome after the event!

## 📄 License

MIT License - Built with ❤️ for immigrant students

## 🙏 Acknowledgments

- Google Gemini API for powerful AI capabilities
- SharkByte 2025 for the opportunity
- Immigrant students everywhere who inspired this project

---

**Built by**: ESLens Team
**For**: SharkByte 2025 Hackathon
**Mission**: Break down language barriers in education, one homework problem at a time.
