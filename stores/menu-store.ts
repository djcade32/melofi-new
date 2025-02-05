import { MenuOptionNames } from "@/enums/general";
import { create } from "zustand";
import useNotificationProviderStore from "./notification-provider-store";

export interface MenuState {
  isMenuOpen: boolean;
  anchorEl: null | HTMLElement;
  selectedOption: MenuOptionNames | null;

  setIsMenuOpen: (boolean: boolean) => void;
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleClose: () => void;
  setSelectedOption: (option: MenuOptionNames | null) => void;
  copyToClipboard: (text: string) => void;
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

  copyToClipboard: (text) => {
    navigator.clipboard.writeText(text);
    useNotificationProviderStore.getState().addNotification({
      message: "Copied to clipboard",
      type: "copy_to_clipboard",
    });
  },
}));

export default useMenuStore;
