const express = require('express');
const dotenv = require('dotenv');
const { fetch } = require('undici');
const path = require('path');

// Load .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.HUGGINGFACE_API_KEY
  });
});

// API endpoint
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  
  // Validate input
  if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
    return res.status(400).json({ error: 'Please provide a valid message.' });
  }
  
  console.log("🟦 User said:", userMessage);

  // Check if API key is configured
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.error("❌ HUGGINGFACE_API_KEY not found in environment variables");
    return res.status(500).json({ 
      error: 'API key not configured. Please create a .env file with HUGGINGFACE_API_KEY=your_api_key_here' 
    });
  }

  try {
    // Simple mock responses for testing (no API key needed)
    const mockResponses = [
      "Hello! I'm your AI assistant. How can I help you today?",
      "That's an interesting question! Let me think about that...",
      "I understand what you're asking. Here's what I think...",
      "Thanks for sharing that with me!",
      "I'm here to help you with any questions you might have.",
      "That's a great point! What else would you like to know?",
      "I'm learning from our conversation. Tell me more!",
      "Interesting perspective! I'd love to hear more about that.",
      "I'm here to chat and help however I can!",
      "That's fascinating! What's on your mind?"
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a response based on the user's message
    const randomIndex = Math.floor(Math.random() * mockResponses.length);
    const botMessage = mockResponses[randomIndex];
    
    console.log("🧠 Mock response generated");

    console.log("🤖 Bot replied:", botMessage);
    res.json({ reply: botMessage });

  } catch (err) {
    console.error("❌ Hugging Face error:", err.message);
    res.status(500).json({ error: 'Something went wrong with Hugging Face API.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});