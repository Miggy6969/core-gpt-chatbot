const axios = require('axios');

async function sendReplyToUser(senderId, replyText) {
  const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;

  const messageData = {
    recipient: { id: senderId },
    message: { text: replyText }
  };

  try {
    if (!senderId) {
      console.warn('🟡 sendReplyToUser – senderId is missing! Cannot send message.');
      return;
    }

    if (!replyText) {
      console.warn(`🟡 sendReplyToUser – No reply text provided for user ${senderId}. Skipping.`);
      return;
    }

    const response = await axios.post(url, messageData);
    console.log(`✅ sendReplyToUser – Successfully sent reply to user ${senderId}: "${replyText}"`);
    return response.data;

  } catch (error) {
    if (error.response) {
      console.error('❌ sendReplyToUser – Failed to send message.');
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ sendReplyToUser – Unexpected error:', error.message);
    }
  }
}

module.exports = sendReplyToUser;