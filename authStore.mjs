import Store from "electron-store";
import "dotenv/config";

const store = new Store({ encryptionKey: process.env.STORE_ENCRYPTION_KEY });

/**
 * Save the authentication token for a specific user.
 * @param {string} email - The Firebase user email.
 * @param {string} password - The Firebase user password.
 * @param {string} token - The Firebase email token.
 */
export function saveUserAuth(email, password, token) {
  console.log("Saving auth creds for email:", email);
  store.set(`userAuths.${email}`, {
    password,
    token,
  });
}

/**
 * Retrieve the authentication token for a specific user.
 * @param {string} email - The Firebase user email.
 * @returns {object | null} - The stored token or null.
 */
export function getUserAuth(email) {
  return store.get(`userAuths.${email}`) || null;
}

/**
 * Clear the stored authentication token for a specific user.
 * @param {string} email - The Firebase user email.
 */
export function clearAuthToken(email) {
  store.delete(`userAuths.${email}`);
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
