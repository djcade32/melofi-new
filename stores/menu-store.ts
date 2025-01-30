import { MenuOptionNames } from "@/enums/general";
import { create } from "zustand";

export interface MenuState {
  isMenuOpen: boolean;
  anchorEl: null | HTMLElement;
  selectedOption: MenuOptionNames | null;

  setIsMenuOpen: (boolean: boolean) => void;
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleClose: () => void;
  setSelectedOption: (option: MenuOptionNames | null) => void;
}

const useMenuStore = create<MenuState>((set, get) => ({
  isMenuOpen: false,
  anchorEl: null,
  selectedOption: null,

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

  setSelectedOption: (option) => {
    set(() => ({ selectedOption: option }));
  },
}));

export default useMenuStore;
