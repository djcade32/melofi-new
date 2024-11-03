import { MelofiUser } from "@/types/interfaces";
import { create } from "zustand";

export interface UserState {
  isUserLoggedIn: boolean;
  currentUser?: MelofiUser;

  setCurrentUser: (user: MelofiUser) => void;
}

const useUserStore = create<UserState>((set, get) => ({
  isUserLoggedIn: false,
  currentUser: undefined,

  setCurrentUser: (user) => {
    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    set({ currentUser: user, isUserLoggedIn: true });
  },
}));

export default useUserStore;
