const dotenv = require('dotenv');
const { fetch } = require('undici');

// Load .env file
dotenv.config();

async function testAPI() {
  console.log('🔍 Testing Hugging Face API...');
  
  // Check if API key exists
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.error('❌ HUGGINGFACE_API_KEY not found in .env file');
    console.log('💡 Please create a .env file with: HUGGINGFACE_API_KEY=your_api_key_here');
    return;
  }
  
  console.log('✅ API key found');
  
  try {
    console.log('🔄 Sending test request...');
    
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: 'Hello, how are you?',
        parameters: { 
          max_new_tokens: 50,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      }),
    });

    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return;
    }

    const data = await response.json();
    console.log('📄 Raw response:', JSON.stringify(data, null, 2));
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      console.log('✅ Success! Bot response:', data[0].generated_text);
    } else if (data.estimated_time) {
      console.log('⏳ Model is loading, estimated time:', data.estimated_time);
    } else {
      console.log('❓ Unexpected response format:', data);
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

testAPI(); 