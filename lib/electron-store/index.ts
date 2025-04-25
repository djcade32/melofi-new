import { onAuthStateChanged } from "firebase/auth";
import { AppSettings, MelofiUser, UserStats } from "@/types/general";
import { getFirebaseAuth } from "../firebase/firebaseClient";
const auth = getFirebaseAuth();

export async function storeUserAuth(email: string, password: string, token: string) {
  if (typeof window !== "undefined" && window.electronAPI) {
    window.electronAPI.saveUserAuth(email, password, token);
    console.log("User creds stored successfully");
  }
}

export async function retrieveUserAuth(
  email: string
): Promise<{ token: string; password: string } | null> {
  if (typeof window !== "undefined" && window.electronAPI) {
    console.log("Retrieving user creds...");
    return window.electronAPI.getUserAuth(email);
  }
  return null;
}

export async function clearAuthToken(email: string) {
  if (typeof window !== "undefined" && window.electronAPI) {
    window.electronAPI.clearAuthToken(email);
  }
}

export function refreshAuthToken(email: string) {
  if (!navigator.onLine) return;

  if (auth) {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const newToken = await user.getIdToken(true);
        // storeAuthToken(email, newToken);
      } else {
        window.electronAPI.clearAuthToken(email);
      }
    });
  } else {
    console.error("Firebase Auth is not initialized");
  }
}

export async function saveUserData(email: string, user: MelofiUser) {
  if (typeof window !== "undefined" && window.electronAPI) {
    window.electronAPI.saveUser(email, user);
    console.log("User data stored successfully");
  }
}

export async function getUserData(email: string): Promise<MelofiUser | null> {
  if (typeof window !== "undefined" && window.electronAPI) {
    return window.electronAPI.getUser(email);
  }
  return null;
}

export async function clearAllAuthTokens() {
  if (typeof window !== "undefined" && window.electronAPI) {
    window.electronAPI.clearAllAuthTokens();
    console.log("All tokens cleared successfully");
  }
}

export async function saveUserStats(email: string, userStats: UserStats) {
  if (typeof window !== "undefined" && window.electronAPI) {
    window.electronAPI.saveUserStats(email, userStats);
    console.log("User stats stored successfully");
  }
}
export async function getUserStats(email: string): Promise<UserStats | null> {
  if (typeof window !== "undefined" && window.electronAPI) {
    return window.electronAPI.getUserStats(email);
  }
  return null;
}

export async function getAppSettings(email: string): Promise<AppSettings | null> {
  if (typeof window !== "undefined" && window.electronAPI) {
    console.log("Retrieving app settings...");
    return window.electronAPI.getAppSettings(email);
  }
  return null;
}

export async function saveAppSettings(email: string, settings: AppSettings) {
  if (typeof window !== "undefined" && window.electronAPI) {
    window.electronAPI.saveAppSettings(email, settings);
    console.log("User app settings stored successfully");
  }
}
