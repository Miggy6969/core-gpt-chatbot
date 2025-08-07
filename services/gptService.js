// services/gptService.js
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateReply(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // You can change to 'gpt-3.5-turbo' if needed
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('❌ GPT error:', error);
    return "Sorry, I'm having trouble thinking right now!";
  }
}

module.exports = { generateReply };