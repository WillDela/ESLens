import React, { useState, useEffect } from 'react';
import './SessionHistory.css';

function SessionHistory({ onSelectSession, onBackHome }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/homework/sessions');
      const data = await response.json();

      if (data.success) {
        setSessions(data.sessions);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to load sessions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectEmoji = (subject) => {
    const emojis = {
      'math': '📐',
      'science': '🔬',
      'reading': '📚',
      'history': '🌍',
      'english': '📝'
    };
    return emojis[subject] || '📄';
  };

  const handleSessionClick = async (session) => {
    try {
      // Fetch full session details including conversation history
      const response = await fetch(`/api/tutor/history/${session.id}`);
      const data = await response.json();

      if (data.success) {
        onSelectSession({
          sessionId: session.id,
          vision: {
            extractedText: session.extracted_text,
            subject: session.subject
          },
          translation: {
            translated: session.translated_text
          },
          tutorMessage: data.history[0]?.content || 'Let\'s continue where we left off!',
          existingHistory: data.history
        });
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    }
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your homework history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <button className="back-button" onClick={onBackHome}>
          ← Back to Home
        </button>
        <h2>📚 Your Homework History</h2>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No homework yet!</h3>
          <p>Upload your first homework to get started.</p>
          <button className="primary-button" onClick={onBackHome}>
            Upload Homework
          </button>
        </div>
      ) : (
        <div className="sessions-grid">
          {sessions.map(session => (
            <div
              key={session.id}
              className="session-card"
              onClick={() => handleSessionClick(session)}
            >
              <div className="session-subject">
                <span className="subject-icon">
                  {getSubjectEmoji(session.subject)}
                </span>
                <span className="subject-name">
                  {session.subject || 'General'}
                </span>
              </div>

              <div className="session-preview">
                {session.extracted_text?.substring(0, 100)}...
              </div>

              <div className="session-footer">
                <span className="session-language">
                  🌍 {session.language}
                </span>
                <span className="session-date">
                  {new Date(session.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="session-status">
                <span className={`status-badge ${session.status}`}>
                  {session.status === 'active' ? '🟢 Active' : '✅ Completed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SessionHistory;
