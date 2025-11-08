import React, { useState } from 'react';
import './App.css';
import Upload from './components/Upload';
import Chat from './components/Chat';
import LanguageSelector from './components/LanguageSelector';
import SessionHistory from './components/SessionHistory';

function App() {
  const [currentSession, setCurrentSession] = useState(null);
  const [language, setLanguage] = useState('spanish');
  const [view, setView] = useState('home'); // 'home', 'chat', 'history'

  const handleHomeworkUploaded = (sessionData) => {
    setCurrentSession(sessionData);
    setView('chat');
  };

  const handleBackHome = () => {
    setView('home');
    setCurrentSession(null);
  };

  const handleViewHistory = () => {
    setView('history');
  };

  const handleSelectSession = (session) => {
    setCurrentSession(session);
    setView('chat');
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="App-header">
        <div className="header-content">
          <h1 className="logo">
            <span className="logo-icon">👁️</span>
            ESLens
          </h1>
          <p className="tagline">AI Tutoring for Immigrant Students</p>
        </div>

        <LanguageSelector
          selectedLanguage={language}
          onLanguageChange={setLanguage}
        />
      </header>

      {/* Main Content */}
      <main className="App-main">
        {view === 'home' && (
          <div className="home-view">
            <div className="welcome-card">
              <h2>Welcome! 👋</h2>
              <p>Take a photo of your homework and I'll help you understand it.</p>
              <p className="sub-text">I won't give you the answers - I'll guide you to discover them yourself!</p>
            </div>

            <Upload
              language={language}
              onHomeworkUploaded={handleHomeworkUploaded}
            />

            <button className="secondary-button" onClick={handleViewHistory}>
              📚 View Past Homework
            </button>
          </div>
        )}

        {view === 'chat' && currentSession && (
          <Chat
            session={currentSession}
            language={language}
            onBackHome={handleBackHome}
          />
        )}

        {view === 'history' && (
          <SessionHistory
            onSelectSession={handleSelectSession}
            onBackHome={handleBackHome}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="App-footer">
        <p>Built with ❤️ for SharkByte 2025</p>
        <p className="tech-stack">
          Powered by Google Gemini AI
        </p>
      </footer>
    </div>
  );
}

export default App;
