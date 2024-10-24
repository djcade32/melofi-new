import { ListItemIcon, ListItemText, MenuItem, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import MuiMenu, { MenuProps as MuiMenuProps } from "@mui/material/Menu";
import { MenuOption } from "@/types/interfaces";
import useAppStore from "@/stores/app-store";
import { use } from "chai";

interface MenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
  options?: MenuOption[];
}

const StyledMenu = styled((props: MuiMenuProps) => (
  <MuiMenu
    // elevation={0}
    // anchorOrigin={{
    //   vertical: 'bottom',
    //   horizontal: 'right',
    // }}
    // transformOrigin={{
    //   vertical: 'top',
    //   horizontal: 'right',
    // }}
    {...props}
  />
))(() => ({
  "& .MuiPaper-root": {
    backgroundColor: "var(--color-secondary-white)",
    borderRadius: 10,
    color: "var(--color-primary)",
    boxShadow: "var(--box-shadow-primary)",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "&:hover": {
        backgroundColor: "var(--color-secondary-opacity)",
      },
    },
  },
}));

const Menu = ({ anchorEl, open, onClose, options }: MenuProps) => {
  const { isFullscreen } = useAppStore();
  const [documentEl, setDocumentEl] = useState<Document | null>(null);

  useEffect(() => {
    if (document) {
      setDocumentEl(document);
    }
  }, []);

  useEffect(() => {
    if (documentEl) {
      console.log(documentEl.querySelector(".fullscreen"));
    }
  }, [documentEl]);

  return (
    <StyledMenu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      // This is a workaround to fix the menu positioning issue when the app is in fullscreen mode
      container={documentEl?.querySelector(".fullscreen") as HTMLElement | null}
    >
      {options?.map((option) => (
        <MenuItem id={option.id} key={option.label} onClick={option.onClick}>
          <ListItemIcon>{option.icon}</ListItemIcon>
          <ListItemText primary={option.label} />
        </MenuItem>
      ))}
    </StyledMenu>
  );
};

export default Menu;
