// routes/webhook.js
const express = require('express');
const router = express.Router();
const sendReplyToUser = require('../services/sendReplyToUser');

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// 📌 This handles Facebook's initial webhook verification (GET request)
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// 📌 This handles incoming messages from users (POST request)
// Add at the top:
const { generateReply } = require('../services/gptService');
const axios = require('axios');
const { getTokenForPage } = require('../services/tokenService');

router.post('/', async (req, res) => {
  try {
    const body = req.body;

    if (body.object !== 'page') {
      console.warn('🟡 webhook.js – Received unknown object type. Expected "page", got:', body.object);
      return res.sendStatus(404);
    }

    body.entry.forEach(async (entry, index) => {
      const webhook_event = entry.messaging?.[0];

      if (!webhook_event) {
        console.warn(`🟡 webhook.js – Entry #${index} is missing "messaging". Skipping...`);
        return;
      }

      const senderId = webhook_event.sender?.id;
      const pageId = entry.id;

      if (!senderId || !pageId) {
        console.warn(`🟡 webhook.js – Missing senderId (${senderId}) or pageId (${pageId}). Can't reply.`);
        return;
      }

      const userMessage = webhook_event.message?.text;

      if (!userMessage) {
        console.log(`ℹ️ webhook.js – No text message found from ${senderId}. Might be a sticker/image/reaction.`);
        return;
      }

      console.log(`💬 webhook.js – Received: "${userMessage}" from user ${senderId}`);

      try {
        const gptReply = await generateReply(userMessage);
        sendReplyToUser(senderId, gptReply);
      } catch (gptError) {
        console.error('❌ webhook.js – GPT reply failed:', gptError.message);
        sendReplyToUser(senderId, "Sorry, something's off with my brain right now. 😵‍💫");
      }
    });

    res.status(200).send('✅ webhook.js – Meta event received and processed');

  } catch (error) {
    console.error('🔥 webhook.js – Critical failure in POST route:', error.message);
    res.sendStatus(500);
  }
});

module.exports = router;