import { create } from "zustand";

export interface MenuState {
  isMenuOpen: boolean;

  setIsMenuOpen: (boolean: boolean) => void;
}

const useMenuStore = create<MenuState>((set, get) => ({
  isMenuOpen: false,

  setIsMenuOpen: (boolean) => {
    set(() => ({ isMenuOpen: boolean }));
  },
}));

export default useMenuStore;
