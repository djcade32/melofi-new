export {};

declare global {
  interface Window {
    electronAPI: {
      saveAuthToken: (email: string, token: string) => void;
      getAuthToken: (email: string) => Promise<string | null>;
      clearAuthToken: (email: string) => void;
      saveUser: (email, user: MelofiUser) => void;
      getUser: (email) => Promise<MelofiUser | null>;
      deleteUser: (email) => void;
      clearAllAuthTokens: () => void;
      saveSettings: (email: string, settings: AppSettings) => void;
      getSettings: (email: string) => Promise<AppSettings>;
      saveUserStats: (email: string, userStats: UserStats) => void;
      getUserStats: (email: string) => Promise<UserStats>;
      isElectron: boolean;
    };
  }
}
