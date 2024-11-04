import { resetPassword } from "@/lib/firebase/actions/auth-actions";
import { getUserFromUserDb } from "@/lib/firebase/getters/auth-getters";
import { MelofiUser } from "@/types/interfaces";
import { create } from "zustand";

export interface UserState {
  isUserLoggedIn: boolean;
  currentUser?: MelofiUser;

  setIsUserLoggedIn: (value: boolean) => void;
  setCurrentUser: (user: MelofiUser) => void;
  checkIfUserIsInDb: (email: string) => Promise<boolean>;
  resetUserPassword: (email: string) => Promise<void>;
}

const useUserStore = create<UserState>((set, get) => ({
  isUserLoggedIn: false,
  currentUser: undefined,

  setIsUserLoggedIn: (value) => {
    set({ isUserLoggedIn: value });
  },
  setCurrentUser: (user) => {
    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    set({ currentUser: user });
  },
  async checkIfUserIsInDb(email) {
    return !!(await getUserFromUserDb(email));
  },
  async resetUserPassword(email) {
    resetPassword(email);
  },
}));

export default useUserStore;
