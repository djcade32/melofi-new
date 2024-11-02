import { create } from "zustand";

export interface UserState {
  isUserLoggedIn: boolean;
}

const useUserStore = create<UserState>((set, get) => ({
  isUserLoggedIn: true,
}));

export default useUserStore;
