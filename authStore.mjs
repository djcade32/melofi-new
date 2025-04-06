import Store from "electron-store";

const store = new Store();

/**
 * Save the authentication token for a specific user.
 * @param {string} email - The Firebase user email.
 * @param {string} token - The Firebase email token.
 */
export function saveAuthToken(email, token) {
  console.log("Saving auth token for email:", email);
  store.set(`authTokens.${email}`, token);
}

/**
 * Retrieve the authentication token for a specific user.
 * @param {string} email - The Firebase user email.
 * @returns {string | null} - The stored token or null.
 */
export function getAuthToken(email) {
  return store.get(`authTokens.${email}`) || null;
}

/**
 * Clear the stored authentication token for a specific user.
 * @param {string} email - The Firebase user email.
 */
export function clearAuthToken(email) {
  store.delete(`authTokens.${email}`);
}

/**
 * Save the user object for a specific email.
 * @param {string} email - The Firebase user email.
 * @param {object} user - The user object to save.
 */
export function saveUser(email, user) {
  store.set(`users.${email}`, user);
}

/**
 * Retrieve the user object for a specific email.
 * @param {string} email - The Firebase user email.
 * @returns {object | null} - The stored user object or null.
 */
export function getUser(email) {
  return store.get(`users.${email}`) || null;
}

/**
 * Clear all stored authentication tokens.
 */
export function clearAllAuthTokens() {
  store.clear();
}

/**
 * Save application settings.
 * @param {object} settings - The settings object to save.
 */
export function saveSettings(settings) {
  store.set("settings", settings);
}
/**
 * Retrieve application settings.
 * @returns {object} - The stored settings object.
 */
export function getSettings() {
  return store.get("settings") || {};
}

/**
 * Save user statistics for a specific email.
 * @param {string} email - The Firebase user email.
 * @param {object} stats - The statistics object to save.
 */
export function saveUserStats(email, stats) {
  store.set(`userStats.${email}`, stats);
}
/**
 * Retrieve user statistics for a specific email.
 * @param {string} email - The Firebase user email.
 * @returns {object | null} - The stored statistics object or null.
 */
export function getUserStats(email) {
  return store.get(`userStats.${email}`) || null;
}
