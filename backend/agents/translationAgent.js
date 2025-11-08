const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Translation Agent - Translates homework text to student's native language
 * Uses Google Gemini for context-aware translation
 */
class TranslationAgent {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Language code mapping
    this.languageNames = {
      'spanish': 'Spanish (Español)',
      'creole': 'Haitian Creole (Kreyòl)',
      'portuguese': 'Portuguese (Português)',
      'vietnamese': 'Vietnamese (Tiếng Việt)',
      'mandarin': 'Mandarin Chinese (中文)',
      'arabic': 'Arabic (العربية)',
      'tagalog': 'Tagalog',
      'french': 'French (Français)',
      'korean': 'Korean (한국어)',
      'russian': 'Russian (Русский)',
      'english': 'English'
    };
  }

  /**
   * Translate text to target language with context preservation
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language (e.g., 'spanish')
   * @param {string} context - Context type ('homework', 'chat', 'general')
   * @returns {Object} - Translation result
   */
  async translate(text, targetLanguage = 'spanish', context = 'homework') {
    try {
      // Don't translate if already in English and no translation needed
      if (targetLanguage === 'english') {
        return {
          original: text,
          translated: text,
          sourceLanguage: 'english',
          targetLanguage: 'english',
          preserved: true
        };
      }

      console.log(`🌐 Translation Agent: Translating to ${targetLanguage}...`);

      const targetLangName = this.languageNames[targetLanguage.toLowerCase()] || targetLanguage;

      // Build context-aware prompt
      const prompt = this._buildTranslationPrompt(text, targetLangName, context);

      // Call Gemini
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text().trim();

      console.log('✅ Translation Agent: Translation complete');

      return {
        original: text,
        translated: translatedText,
        sourceLanguage: 'english',
        targetLanguage: targetLanguage
      };

    } catch (error) {
      console.error('❌ Translation Agent error:', error);
      // Fallback: return original text if translation fails
      return {
        original: text,
        translated: text,
        sourceLanguage: 'english',
        targetLanguage: targetLanguage,
        error: error.message
      };
    }
  }

  /**
   * Build context-specific translation prompt
   */
  _buildTranslationPrompt(text, targetLanguage, context) {
    const basePrompt = `Translate the following text from English to ${targetLanguage}.`;

    const contextInstructions = {
      homework: `
This is homework content for a student.

IMPORTANT RULES:
- Preserve ALL mathematical notation, equations, and numbers exactly as written
- Keep formatting like bullet points, numbering, and line breaks
- Translate natural language but keep technical terms clear
- If there are equations (like "3x + 5 = 14"), keep them in the same format
- Make the translation clear and appropriate for a middle school or high school student

Text to translate:
${text}

Provide ONLY the translation, no additional commentary.`,

      chat: `
This is a conversational message from an AI tutor to a student.

IMPORTANT RULES:
- Maintain a warm, encouraging, and friendly tone
- Use clear, simple language appropriate for students
- Preserve any questions or prompts in the message
- Keep the Socratic teaching style if present

Text to translate:
${text}

Provide ONLY the translation, no additional commentary.`,

      general: `
Translate this text naturally and accurately.

Text to translate:
${text}

Provide ONLY the translation, no additional commentary.`
    };

    return basePrompt + (contextInstructions[context] || contextInstructions.general);
  }

  /**
   * Detect language of text (utility function)
   */
  async detectLanguage(text) {
    try {
      const prompt = `What language is this text written in? Respond with just the language name in English (e.g., "Spanish", "French", "English").

Text: ${text}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const detectedLang = response.text().trim().toLowerCase();

      return detectedLang;

    } catch (error) {
      console.error('Language detection error:', error);
      return 'unknown';
    }
  }
}

module.exports = new TranslationAgent();
