const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Import AI agents
const visionAgent = require('./agents/visionAgent');
const translationAgent = require('./agents/translationAgent');
const tutoringAgent = require('./agents/tutoringAgent');

// Import database
const db = require('./database/db');

// ============= ROUTES =============

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Upload and process homework image
app.post('/api/homework/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { language = 'spanish' } = req.body;
    const imagePath = req.file.path;

    console.log(`Processing homework image: ${imagePath}`);

    // Step 1: Extract text from image using Vision Agent
    const visionResult = await visionAgent.extractHomework(imagePath);

    // Step 2: Translate to student's native language using Translation Agent
    const translationResult = await translationAgent.translate(
      visionResult.extractedText,
      language,
      'homework'
    );

    // Step 3: Create homework session in database
    const sessionId = db.createHomeworkSession({
      imagePath: imagePath,
      extractedText: visionResult.extractedText,
      translatedText: translationResult.translated,
      subject: visionResult.subject,
      language: language
    });

    // Step 4: Start tutoring session
    const tutorResponse = await tutoringAgent.startSession(
      visionResult.extractedText,
      visionResult.subject,
      language
    );

    // Save tutor's first message
    db.saveMessage(sessionId, 'assistant', tutorResponse.message, language);

    res.json({
      success: true,
      sessionId: sessionId,
      vision: {
        extractedText: visionResult.extractedText,
        subject: visionResult.subject,
        hasEquations: visionResult.hasEquations
      },
      translation: {
        original: visionResult.extractedText,
        translated: translationResult.translated,
        language: language
      },
      tutorMessage: tutorResponse.message
    });

  } catch (error) {
    console.error('Error processing homework:', error);
    res.status(500).json({
      error: 'Failed to process homework',
      message: error.message
    });
  }
});

// Continue tutoring conversation
app.post('/api/tutor/chat', async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'sessionId and message are required' });
    }

    // Get session details
    const session = db.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get conversation history
    const history = db.getConversationHistory(sessionId);

    // Save student's message
    db.saveMessage(sessionId, 'user', message, session.language);

    // Get tutor response
    const tutorResponse = await tutoringAgent.continueConversation(
      history,
      message,
      session.extractedText,
      session.subject
    );

    // Save tutor's response
    db.saveMessage(sessionId, 'assistant', tutorResponse.message, session.language);

    res.json({
      success: true,
      message: tutorResponse.message,
      understandingLevel: tutorResponse.understandingLevel,
      suggestedNextStep: tutorResponse.suggestedNextStep
    });

  } catch (error) {
    console.error('Error in tutoring chat:', error);
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message
    });
  }
});

// Get conversation history
app.get('/api/tutor/history/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = db.getConversationHistory(sessionId);
    const session = db.getSession(sessionId);

    res.json({
      success: true,
      session: session,
      history: history
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      error: 'Failed to fetch history',
      message: error.message
    });
  }
});

// Get all sessions for a user (simplified - no auth for MVP)
app.get('/api/homework/sessions', (req, res) => {
  try {
    const sessions = db.getAllSessions();
    res.json({
      success: true,
      sessions: sessions
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      error: 'Failed to fetch sessions',
      message: error.message
    });
  }
});

// Translate text (standalone endpoint)
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage, context = 'general' } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'text and targetLanguage are required' });
    }

    const result = await translationAgent.translate(text, targetLanguage, context);

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Error translating:', error);
    res.status(500).json({
      error: 'Failed to translate',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 ESLens Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not configured'}\n`);
});

module.exports = app;
