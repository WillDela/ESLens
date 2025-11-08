const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Initialize SQLite database
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
function initDatabase() {
  // Users table (simplified for MVP - no auth)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT,
      native_language TEXT DEFAULT 'spanish',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Homework sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS homework_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT DEFAULT 'default_user',
      image_path TEXT,
      extracted_text TEXT,
      translated_text TEXT,
      subject TEXT,
      language TEXT DEFAULT 'spanish',
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Conversation messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversation_messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      language TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES homework_sessions(id)
    )
  `);

  // Create default user for MVP
  const defaultUser = db.prepare('SELECT id FROM users WHERE id = ?').get('default_user');
  if (!defaultUser) {
    db.prepare('INSERT INTO users (id, email, native_language) VALUES (?, ?, ?)').run(
      'default_user',
      'demo@eslens.app',
      'spanish'
    );
  }

  console.log('✅ Database initialized successfully');
}

// Initialize database on module load
initDatabase();

// ============= DATABASE OPERATIONS =============

/**
 * Create a new homework session
 */
function createHomeworkSession(data) {
  const sessionId = uuidv4();
  const stmt = db.prepare(`
    INSERT INTO homework_sessions
    (id, user_id, image_path, extracted_text, translated_text, subject, language, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    sessionId,
    'default_user',
    data.imagePath,
    data.extractedText,
    data.translatedText,
    data.subject,
    data.language,
    'active'
  );

  return sessionId;
}

/**
 * Get session by ID
 */
function getSession(sessionId) {
  const stmt = db.prepare('SELECT * FROM homework_sessions WHERE id = ?');
  return stmt.get(sessionId);
}

/**
 * Get all sessions (for history page)
 */
function getAllSessions(limit = 50) {
  const stmt = db.prepare(`
    SELECT * FROM homework_sessions
    ORDER BY created_at DESC
    LIMIT ?
  `);
  return stmt.all(limit);
}

/**
 * Save a conversation message
 */
function saveMessage(sessionId, role, content, language) {
  const messageId = uuidv4();
  const stmt = db.prepare(`
    INSERT INTO conversation_messages (id, session_id, role, content, language)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(messageId, sessionId, role, content, language);
  return messageId;
}

/**
 * Get conversation history for a session
 */
function getConversationHistory(sessionId, limit = 100) {
  const stmt = db.prepare(`
    SELECT role, content, language, timestamp
    FROM conversation_messages
    WHERE session_id = ?
    ORDER BY timestamp ASC
    LIMIT ?
  `);

  return stmt.all(sessionId, limit);
}

/**
 * Update session status
 */
function updateSessionStatus(sessionId, status) {
  const stmt = db.prepare('UPDATE homework_sessions SET status = ? WHERE id = ?');
  stmt.run(status, sessionId);
}

/**
 * Get user statistics
 */
function getUserStats(userId = 'default_user') {
  const totalSessions = db.prepare(
    'SELECT COUNT(*) as count FROM homework_sessions WHERE user_id = ?'
  ).get(userId).count;

  const subjectBreakdown = db.prepare(`
    SELECT subject, COUNT(*) as count
    FROM homework_sessions
    WHERE user_id = ?
    GROUP BY subject
  `).all(userId);

  const totalMessages = db.prepare(`
    SELECT COUNT(*) as count
    FROM conversation_messages cm
    JOIN homework_sessions hs ON cm.session_id = hs.id
    WHERE hs.user_id = ?
  `).get(userId).count;

  return {
    totalSessions,
    subjectBreakdown,
    totalMessages
  };
}

module.exports = {
  db,
  createHomeworkSession,
  getSession,
  getAllSessions,
  saveMessage,
  getConversationHistory,
  updateSessionStatus,
  getUserStats
};
