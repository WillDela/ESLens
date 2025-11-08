import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat({ session, language, onBackHome }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialize with first tutor message
    if (session && session.tutorMessage) {
      setMessages([{
        role: 'assistant',
        content: session.tutorMessage,
        timestamp: new Date()
      }]);
    }
  }, [session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sending) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSending(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          message: userMessage.content
        })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          understandingLevel: data.understandingLevel
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Error message
        setMessages(prev => [...prev, {
          role: 'system',
          content: 'Error: ' + data.error,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Failed to send message: ' + error.message,
        timestamp: new Date()
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      // Set language based on student's native language
      const languageCodes = {
        'spanish': 'es-ES',
        'french': 'fr-FR',
        'portuguese': 'pt-BR',
        'mandarin': 'zh-CN',
        'arabic': 'ar-SA',
        'korean': 'ko-KR',
        'russian': 'ru-RU',
        'vietnamese': 'vi-VN',
        'tagalog': 'tl-PH'
      };

      utterance.lang = languageCodes[language] || 'en-US';
      utterance.rate = 0.9; // Slightly slower for clarity

      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <button className="back-button" onClick={onBackHome}>
          ← Back
        </button>
        <div className="session-info">
          <span className="subject-badge">{session.vision?.subject || 'homework'}</span>
          <span className="language-badge">{language}</span>
        </div>
      </div>

      {/* Homework Context */}
      <div className="homework-context">
        <details>
          <summary>📝 View Original Homework</summary>
          <div className="context-content">
            <div className="context-section">
              <h4>Original (English):</h4>
              <p>{session.vision?.extractedText}</p>
            </div>
            {session.translation && (
              <div className="context-section">
                <h4>Translated ({language}):</h4>
                <p>{session.translation.translated}</p>
              </div>
            )}
          </div>
        </details>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role}`}
          >
            <div className="message-header">
              <span className="message-role">
                {msg.role === 'user' ? '👤 You' : '🤖 ESLens Tutor'}
              </span>
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">
              {msg.content}
            </div>
            {msg.role === 'assistant' && (
              <button
                className="speak-button"
                onClick={() => speakMessage(msg.content)}
                title="Read aloud"
              >
                🔊 Speak
              </button>
            )}
            {msg.understandingLevel && (
              <div className="understanding-badge">
                {msg.understandingLevel === 'good' && '✅ Understanding well'}
                {msg.understandingLevel === 'struggling' && '💭 Needs help'}
                {msg.understandingLevel === 'progressing' && '📈 Progressing'}
              </div>
            )}
          </div>
        ))}

        {sending && (
          <div className="message assistant typing">
            <div className="message-header">
              <span className="message-role">🤖 ESLens Tutor</span>
            </div>
            <div className="message-content">
              <span className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <div className="reminder-text">
          💡 Tip: I'll guide you with questions, not give you the answer!
        </div>
        <div className="input-wrapper">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your question or tell me what you're thinking..."
            disabled={sending}
            rows="2"
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || sending}
          >
            {sending ? '...' : '📤 Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
