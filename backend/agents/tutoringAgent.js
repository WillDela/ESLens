const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Tutoring Agent - Core AI tutor using Socratic method
 * Uses Google Gemini 1.5 Pro for sophisticated conversational tutoring
 *
 * CRITICAL: This agent NEVER gives direct answers - only guides with questions
 */
class TutoringAgent {
  constructor() {
    // Use Pro model for better reasoning and conversation
    this.model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    this.systemPrompt = this._buildSystemPrompt();
  }

  /**
   * Core system prompt - defines the tutor's behavior
   * THIS IS THE MOST IMPORTANT PART OF THE ENTIRE APP
   */
  _buildSystemPrompt() {
    return `You are ESLens Tutor, an AI tutor specifically designed to help immigrant students who are learning in English but speak other languages natively.

🎯 YOUR CORE MISSION:
Help students LEARN and UNDERSTAND - never just give them answers.

⚠️ CRITICAL RULES - NEVER BREAK THESE:

1. **NEVER GIVE DIRECT ANSWERS**
   ❌ DON'T: "The answer is 42"
   ❌ DON'T: "To solve this, subtract 5 from both sides to get x = 3"
   ✅ DO: "What operation could help us isolate x?"
   ✅ DO: "What do you think happens if we subtract 5 from both sides?"

2. **ALWAYS USE THE SOCRATIC METHOD**
   - Ask guiding questions that lead students to discover answers themselves
   - Break complex problems into smaller, manageable steps
   - Let the student do the thinking and problem-solving

3. **BE PATIENT AND ENCOURAGING**
   - Remember: these students are learning in a second language
   - Use simple, clear language - avoid idioms and complex vocabulary
   - Celebrate small wins: "Great thinking!", "You're on the right track!"
   - If they're frustrated, acknowledge it: "I know this is challenging, let's break it down together"

4. **ADAPT TO THEIR LEVEL**
   - If they seem lost, ask even simpler questions
   - If they're progressing well, gradually increase complexity
   - Always meet them where they are

5. **BE CULTURALLY SENSITIVE**
   - These are immigrant students who may face language barriers
   - Be extra patient if they seem confused - it might be language, not understanding
   - Use universal examples when possible (food, family, everyday situations)

📝 YOUR TEACHING APPROACH:

When a student asks about a problem:
1. First ask what they already understand: "What part of this problem do you understand?"
2. Guide them through the solution step by step with questions
3. If they're stuck, give a tiny hint, not the full solution
4. Ask them to explain their reasoning: "Why do you think that?"
5. Correct gently if they're wrong: "Hmm, let's think about that again..."

🎓 EXAMPLE INTERACTION (PERFECT TUTORING):

Student: "How do I solve 3x + 5 = 14?"
YOU: "Great question! Let's work through this together. First, what is our goal here - what are we trying to find?"

Student: "We need to find x"
YOU: "Exactly right! Now, look at the left side of the equation. Is x by itself, or is it with other numbers?"

Student: "It's with other numbers"
YOU: "Good observation! There's 3x and there's +5. To find x, we need to get it alone. What do you think we should try to remove first - the 3 or the +5?"

Student: "The +5?"
YOU: "Excellent thinking! And how can we remove +5? What's the opposite operation of adding 5?"

Student: "Subtracting 5"
YOU: "Perfect! Now here's an important rule: whatever we do to one side of the equation, we must do to the other side to keep it balanced. So if we subtract 5 from the left side, what must we do to the right side?"

Student: "Subtract 5 from the right side too"
YOU: "Yes! So what do we get? Work it out: (3x + 5 - 5) = (14 - 5)"

Student: "3x = 9"
YOU: "Fantastic! You're almost there. Now we have 3x = 9. How can we get x by itself?"

[And so on...]

❌ WHAT YOU SHOULD NEVER DO:

Student: "How do I solve 3x + 5 = 14?"
YOU: "Subtract 5 from both sides to get 3x = 9, then divide both sides by 3 to get x = 3."
^^^ THIS IS TERRIBLE TUTORING - YOU ARE DOING THE WORK FOR THEM ^^^

🌟 REMEMBER:
- Your job is to help them LEARN, not to do their homework for them
- The struggle is part of learning - guide them through it
- Questions are more powerful than answers
- Every student can learn - you just need to find the right way to explain it

Be warm, patient, and encouraging. You are their supportive homework buddy, helping them discover they're smarter than they think.`;
  }

  /**
   * Start a new tutoring session
   * @param {string} homeworkText - The extracted homework text
   * @param {string} subject - The subject (math, science, reading, etc.)
   * @param {string} studentLanguage - Student's native language
   * @returns {Object} - Initial tutor message
   */
  async startSession(homeworkText, subject, studentLanguage) {
    try {
      console.log('🎓 Tutoring Agent: Starting new session...');
      console.log(`   Subject: ${subject}`);
      console.log(`   Language: ${studentLanguage}`);

      const prompt = `${this.systemPrompt}

---

A student needs help with this ${subject} homework:

"""
${homeworkText}
"""

The student's native language is ${studentLanguage}, but they're learning in English.

Start the tutoring session by:
1. Greeting them warmly
2. Asking what specific part they need help with
3. Making them feel comfortable and supported

Keep your response friendly, clear, and in simple English (they're still learning!).
DO NOT solve any problems yet - just start the conversation.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const message = response.text().trim();

      console.log('✅ Tutoring Agent: Session started');

      return {
        message: message,
        sessionStarted: true
      };

    } catch (error) {
      console.error('❌ Tutoring Agent error (start session):', error);
      throw new Error(`Failed to start tutoring session: ${error.message}`);
    }
  }

  /**
   * Continue the tutoring conversation
   * @param {Array} conversationHistory - Previous messages
   * @param {string} studentMessage - Student's current message
   * @param {string} homeworkContext - Original homework text for context
   * @param {string} subject - Subject being tutored
   * @returns {Object} - Tutor response with analysis
   */
  async continueConversation(conversationHistory, studentMessage, homeworkContext, subject) {
    try {
      console.log('💬 Tutoring Agent: Processing student message...');

      // Build conversation context for Gemini
      const conversationText = this._formatConversationHistory(conversationHistory);

      const prompt = `${this.systemPrompt}

---

HOMEWORK CONTEXT:
"""
${homeworkContext}
"""

SUBJECT: ${subject}

CONVERSATION SO FAR:
${conversationText}

STUDENT'S LATEST MESSAGE:
"""
${studentMessage}
"""

---

Respond to the student using the Socratic method. Remember:
- Ask guiding questions, don't give answers
- If they're stuck, give a small hint through a question
- If they got something right, celebrate it and move to the next step
- If they're confused, break it down into even smaller pieces
- Be encouraging and patient

Your response:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const message = response.text().trim();

      // Analyze understanding level
      const understandingAnalysis = this._analyzeUnderstanding(
        conversationHistory,
        studentMessage
      );

      console.log('✅ Tutoring Agent: Response generated');
      console.log(`   Understanding level: ${understandingAnalysis.level}`);

      return {
        message: message,
        understandingLevel: understandingAnalysis.level,
        suggestedNextStep: understandingAnalysis.nextStep
      };

    } catch (error) {
      console.error('❌ Tutoring Agent error (continue conversation):', error);
      throw new Error(`Failed to continue conversation: ${error.message}`);
    }
  }

  /**
   * Format conversation history for Gemini
   */
  _formatConversationHistory(history) {
    if (!history || history.length === 0) {
      return "(No previous conversation)";
    }

    return history
      .slice(-10) // Last 10 messages for context
      .map(msg => {
        const role = msg.role === 'user' ? 'STUDENT' : 'TUTOR';
        return `${role}: ${msg.content}`;
      })
      .join('\n\n');
  }

  /**
   * Analyze student's understanding level based on their messages
   * Simple heuristic-based analysis
   */
  _analyzeUnderstanding(history, latestMessage) {
    const message = latestMessage.toLowerCase();

    // Positive indicators
    const understandingIndicators = [
      'oh i see', 'got it', 'understand', 'makes sense',
      'i think', 'so if', 'that means', 'oh okay',
      'right', 'yes', 'yeah'
    ];

    // Confusion indicators
    const confusionIndicators = [
      'confused', "don't understand", "don't get it",
      'what does', 'help', 'idk', "i don't know",
      'stuck', 'lost', 'what', 'huh', '???'
    ];

    // Progress indicators (attempting to solve)
    const progressIndicators = [
      'is it', 'would it be', 'should i',
      'do i', 'if i', 'so then'
    ];

    // Check indicators
    const hasUnderstanding = understandingIndicators.some(ind => message.includes(ind));
    const hasConfusion = confusionIndicators.some(ind => message.includes(ind));
    const hasProgress = progressIndicators.some(ind => message.includes(ind));

    // Determine level and next step
    if (hasUnderstanding || hasProgress) {
      return {
        level: 'good',
        nextStep: 'continue_guiding',
        confidence: 'medium'
      };
    } else if (hasConfusion) {
      return {
        level: 'struggling',
        nextStep: 'simplify_and_break_down',
        confidence: 'high'
      };
    } else {
      return {
        level: 'progressing',
        nextStep: 'continue_socratic',
        confidence: 'low'
      };
    }
  }

  /**
   * Validate that response doesn't give direct answers
   * (Optional quality check - can be used in testing)
   */
  _validateResponse(response) {
    const directAnswerPhrases = [
      'the answer is',
      'the solution is',
      'equals to',
      'x =',
      'therefore',
      'so the result is'
    ];

    const hasDirectAnswer = directAnswerPhrases.some(phrase =>
      response.toLowerCase().includes(phrase)
    );

    return {
      isValid: !hasDirectAnswer,
      warning: hasDirectAnswer ? 'Response may contain direct answer' : null
    };
  }
}

module.exports = new TutoringAgent();
