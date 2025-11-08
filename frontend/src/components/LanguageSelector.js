import React from 'react';
import './LanguageSelector.css';

const SUPPORTED_LANGUAGES = [
  { code: 'spanish', name: 'Español', flag: '🇪🇸' },
  { code: 'creole', name: 'Kreyòl', flag: '🇭🇹' },
  { code: 'portuguese', name: 'Português', flag: '🇧🇷' },
  { code: 'vietnamese', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'mandarin', name: '中文', flag: '🇨🇳' },
  { code: 'arabic', name: 'العربية', flag: '🇸🇦' },
  { code: 'tagalog', name: 'Tagalog', flag: '🇵🇭' },
  { code: 'french', name: 'Français', flag: '🇫🇷' },
  { code: 'korean', name: '한국어', flag: '🇰🇷' },
  { code: 'russian', name: 'Русский', flag: '🇷🇺' },
  { code: 'english', name: 'English', flag: '🇺🇸' },
];

function LanguageSelector({ selectedLanguage, onLanguageChange }) {
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);

  return (
    <div className="language-selector">
      <label htmlFor="language-select">
        <span className="language-label">🌍 Your Language:</span>
      </label>
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="language-dropdown"
      >
        {SUPPORTED_LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
