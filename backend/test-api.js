/**
 * Test script for ESLens API
 * Run: node test-api.js
 *
 * Make sure the server is running: npm run dev
 */

const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3001';

async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Health check passed:', data);

    if (!data.geminiConfigured) {
      console.log('⚠️  WARNING: Gemini API key not configured!');
      console.log('   Add your API key to .env file: GEMINI_API_KEY=your_key_here');
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.log('   Make sure the server is running: npm run dev');
    return false;
  }
}

async function testTranslation() {
  console.log('\n🌐 Testing Translation Agent...');
  try {
    const response = await fetch(`${API_URL}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Solve for x: 3x + 5 = 14',
        targetLanguage: 'spanish',
        context: 'homework'
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Translation successful!');
      console.log('   Original:', data.original);
      console.log('   Translated:', data.translated);
    } else {
      console.log('❌ Translation failed:', data.error);
    }

    return data.success;
  } catch (error) {
    console.error('❌ Translation test failed:', error.message);
    return false;
  }
}

async function testHomeworkUpload(imagePath) {
  console.log('\n📸 Testing Homework Upload...');

  if (!fs.existsSync(imagePath)) {
    console.log('⚠️  No test image found at:', imagePath);
    console.log('   Please add a homework image to test the vision agent');
    console.log('   You can skip this test for now.');
    return true; // Skip, not a failure
  }

  try {
    const FormData = require('form-data');
    const form = new FormData();

    form.append('image', fs.createReadStream(imagePath));
    form.append('language', 'spanish');

    const response = await fetch(`${API_URL}/api/homework/upload`, {
      method: 'POST',
      body: form
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Homework upload successful!');
      console.log('   Session ID:', data.sessionId);
      console.log('   Extracted Text:', data.vision.extractedText.substring(0, 100) + '...');
      console.log('   Subject:', data.vision.subject);
      console.log('   Translated:', data.translation.translated.substring(0, 100) + '...');
      console.log('   Tutor Message:', data.tutorMessage.substring(0, 100) + '...');

      // Store session ID for chat test
      return data.sessionId;
    } else {
      console.log('❌ Upload failed:', data.error);
      return false;
    }

  } catch (error) {
    console.error('❌ Upload test failed:', error.message);
    return false;
  }
}

async function testTutorChat(sessionId) {
  if (!sessionId) {
    console.log('\n⚠️  Skipping chat test (no session ID)');
    return true;
  }

  console.log('\n💬 Testing Tutor Chat...');

  try {
    const response = await fetch(`${API_URL}/api/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId,
        message: "I don't understand how to start this problem"
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Chat response received!');
      console.log('   Tutor says:', data.message.substring(0, 200) + '...');
      console.log('   Understanding level:', data.understandingLevel);
      console.log('   Next step:', data.suggestedNextStep);

      // Verify Socratic method (should ask questions, not give answers)
      const hasDirect Answers = data.message.toLowerCase().includes('the answer is') ||
                                data.message.toLowerCase().includes('x =');

      if (hasDirectAnswers) {
        console.log('⚠️  WARNING: Response may contain direct answers (violates Socratic method)');
      } else {
        console.log('✅ Socratic method verified (no direct answers given)');
      }

    } else {
      console.log('❌ Chat failed:', data.error);
    }

    return data.success;
  } catch (error) {
    console.error('❌ Chat test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 ESLens API Test Suite');
  console.log('========================\n');

  const healthOk = await testHealthCheck();

  if (!healthOk) {
    console.log('\n⚠️  Cannot proceed with tests - server not ready');
    console.log('   1. Make sure server is running: cd backend && npm run dev');
    console.log('   2. Add Gemini API key to .env file');
    process.exit(1);
  }

  await testTranslation();

  const sessionId = await testHomeworkUpload(
    path.join(__dirname, 'test-homework.jpg') // You'll need to add a test image
  );

  await testTutorChat(sessionId);

  console.log('\n✅ Test suite complete!');
  console.log('\nNext steps:');
  console.log('1. Add a test homework image to backend/test-homework.jpg');
  console.log('2. Test the full flow with a real homework image');
  console.log('3. Build the React frontend');
}

runTests();
