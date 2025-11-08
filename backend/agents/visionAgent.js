const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Vision Agent - Extracts text, equations, and structure from homework images
 * Uses Google Gemini Vision API
 */
class VisionAgent {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Extract homework content from image
   * @param {string} imagePath - Path to uploaded image
   * @returns {Object} - Extracted text, subject, and metadata
   */
  async extractHomework(imagePath) {
    try {
      console.log('🔍 Vision Agent: Extracting text from image...');

      // Read image file
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString('base64');
      const mimeType = this._getMimeType(imagePath);

      // Prepare prompt for Gemini Vision
      const prompt = `You are an expert at extracting text from homework images.

Extract ALL text from this homework image and return a JSON response with the following structure:

{
  "extractedText": "The complete text from the image, preserving structure like headings, questions, equations",
  "subject": "math" | "science" | "reading" | "history" | "other",
  "hasEquations": true/false,
  "difficulty": "elementary" | "middle_school" | "high_school",
  "questions": ["question 1", "question 2", ...]
}

Important:
- Preserve ALL text exactly as written, including numbers, equations, and special characters
- For math equations, keep them readable (e.g., "3x + 5 = 14")
- Identify the subject based on content
- Extract individual questions if multiple exist
- If text is handwritten and unclear, do your best to interpret it

Return ONLY the JSON, no additional text.`;

      // Call Gemini Vision API
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      let parsedData;
      try {
        // Remove markdown code blocks if present
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedData = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON:', text);
        // Fallback: treat entire response as extracted text
        parsedData = {
          extractedText: text,
          subject: 'other',
          hasEquations: false,
          difficulty: 'middle_school',
          questions: [text]
        };
      }

      console.log('✅ Vision Agent: Extraction complete');
      console.log(`   Subject: ${parsedData.subject}`);
      console.log(`   Has equations: ${parsedData.hasEquations}`);
      console.log(`   Questions found: ${parsedData.questions?.length || 0}`);

      return {
        extractedText: parsedData.extractedText,
        subject: parsedData.subject || 'other',
        hasEquations: parsedData.hasEquations || false,
        difficulty: parsedData.difficulty || 'middle_school',
        questions: parsedData.questions || [parsedData.extractedText],
        rawResponse: text
      };

    } catch (error) {
      console.error('❌ Vision Agent error:', error);
      throw new Error(`Vision extraction failed: ${error.message}`);
    }
  }

  /**
   * Get MIME type from file extension
   */
  _getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }
}

module.exports = new VisionAgent();
