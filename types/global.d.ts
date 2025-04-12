export {};

declare global {
  interface Window {
    electronAPI: {
      saveUserAuth: (email: string, password: string, token: string) => void;
      getUserAuth: (email: string) => Promise<{ token: string; password: string } | null>;
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
