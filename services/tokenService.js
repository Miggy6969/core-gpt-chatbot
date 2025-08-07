// services/tokenService.js

// Placeholder for future database logic (e.g., get/set tokens per client)
async function getTokenForPage(pageId) {
  // In Phase 2: Lookup token from DB based on pageId
  return process.env.PAGE_ACCESS_TOKEN; // Temporary: from .env
}

module.exports = { getTokenForPage };