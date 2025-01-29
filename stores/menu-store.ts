import { create } from "zustand";

export interface MenuState {
  isMenuOpen: boolean;
  anchorEl: null | HTMLElement;

  setIsMenuOpen: (boolean: boolean) => void;
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleClose: () => void;
}

const useMenuStore = create<MenuState>((set, get) => ({
  isMenuOpen: false,
  anchorEl: null,

  setIsMenuOpen: (boolean) => {
    set(() => ({ isMenuOpen: boolean }));
  },

  handleClick: (event) => {
    set(() => ({ anchorEl: event.currentTarget }));
    set(() => ({ isMenuOpen: !get().isMenuOpen }));
  },

  handleClose: () => {
    set(() => ({ anchorEl: null }));
    set(() => ({ isMenuOpen: false }));
  },
}));

export default useMenuStore;
