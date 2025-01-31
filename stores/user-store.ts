import { resetPassword } from "@/lib/firebase/actions/auth-actions";
import { getUserFromUserDb } from "@/lib/firebase/getters/auth-getters";
import { MelofiUser, UserStats } from "@/types/general";
import { create } from "zustand";

export interface UserState {
  isUserLoggedIn: boolean;
  currentUser?: MelofiUser;
  userStats?: UserStats;

  setIsUserLoggedIn: (value: boolean) => void;
  setCurrentUser: (user: MelofiUser) => void;
  checkIfUserIsInDb: (uid: string) => Promise<boolean>;
  resetUserPassword: (email: string) => Promise<void>;
}

const useUserStore = create<UserState>((set, get) => ({
  isUserLoggedIn: false,
  currentUser: undefined,
  userStats: undefined,

  setIsUserLoggedIn: (value) => {
    set({ isUserLoggedIn: value });
  },
  setCurrentUser: (user) => {
    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    set({ currentUser: user });
  },
  async checkIfUserIsInDb(uid) {
    if (process.env.NEXT_PUBLIC_IS_CYPRESS) {
      console.log("Mocked checkIfUserIsInDb");
      return true;
    }
    return !!(await getUserFromUserDb(uid));
  },
  async resetUserPassword(email) {
    resetPassword(email);
  },
}));

export default useUserStore;
