# ESLens - Quick Start Guide

**⏱️ Time to first run: 5 minutes**

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

## Step 2: Configure Environment

Open `.env` file in the root directory and add your key:

```bash
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

## Step 3: Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
✅ Database initialized successfully
🚀 ESLens Backend Server running on port 3001
🔑 Gemini API: ✅ Configured
```

## Step 4: Test the API

### Option A: Use curl (Quick Test)

```bash
# Health check
curl http://localhost:3001/api/health

# Test translation
curl -X POST http://localhost:3001/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Solve for x: 3x + 5 = 14",
    "targetLanguage": "spanish"
  }'
```

### Option B: Use the test script

```bash
# In a new terminal
cd backend
node test-api.js
```

## Step 5: Test with Real Homework

1. Take a photo of math homework or find one online
2. Save it as `backend/test-homework.jpg`
3. Upload it:

```bash
curl -X POST http://localhost:3001/api/homework/upload \
  -F "image=@backend/test-homework.jpg" \
  -F "language=spanish"
```

You'll get back:
- ✅ Extracted text from the image
- ✅ Translation to Spanish
- ✅ Tutor's first message (using Socratic method)
- ✅ Session ID for continuing the conversation

4. Chat with the tutor:

```bash
curl -X POST http://localhost:3001/api/tutor/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "YOUR_SESSION_ID_HERE",
    "message": "I dont understand how to start"
  }'
```

## 🎯 What's Working Now

✅ **Backend API** (100% functional)
- Vision Agent: Extract text from homework images
- Translation Agent: Translate to 10+ languages
- Tutoring Agent: Socratic method teaching (NEVER gives answers)
- Database: Store sessions and conversations

## 🚧 What's Next

1. **Frontend** (React app for easy interaction)
2. **Voice** (ElevenLabs text-to-speech)
3. **Deployment** (GoDaddy domain + hosting)
4. **Demo Video** (For hackathon submission)

## 🐛 Troubleshooting

**Server won't start:**
- Make sure Node.js 18+ is installed: `node --version`
- Check if port 3001 is available
- Look for errors in the terminal

**"Gemini API: ❌ Not configured":**
- Make sure you added the API key to `.env` file
- The key should start with `AIza`
- No quotes needed around the key
- Restart the server after adding the key

**"Cannot read file" error:**
- Make sure the image file exists
- Check the file path is correct
- Image should be JPG, PNG, or GIF

**Translation not working:**
- Gemini API key is required
- Check internet connection
- Try a smaller text first

## 📝 API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Check if server is running |
| `/api/homework/upload` | POST | Upload homework image |
| `/api/tutor/chat` | POST | Chat with tutor |
| `/api/tutor/history/:id` | GET | Get conversation history |
| `/api/translate` | POST | Translate text |
| `/api/homework/sessions` | GET | Get all sessions |

## 🚀 Ready for Frontend?

Once the backend is tested and working:

```bash
cd ../frontend
npm install
npm start
```

(Frontend coming next!)

## 💡 Tips

- Keep the backend server running in one terminal
- Use another terminal for testing/frontend
- Check `backend/database.sqlite` to see stored data
- Look in `backend/uploads/` for uploaded images
- Read `backend/agents/tutoringAgent.js` to see the Socratic prompt

---

**Need help?** Check the main README.md or create an issue.
