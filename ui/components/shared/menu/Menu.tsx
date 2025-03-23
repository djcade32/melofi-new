import { ListItemIcon, ListItemText, MenuItem, styled } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import MuiMenu, { MenuProps as MuiMenuProps } from "@mui/material/Menu";
import { MenuOption } from "@/types/general";
import useAppStore from "@/stores/app-store";
import { PiCrownSimpleFill } from "@/imports/icons";

interface MenuProps {
  id?: string;
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
  options?: MenuOption[];
  offset?: number;
  invertColors?: boolean;
}

const Menu = memo(
  ({
    id = "basic-menu",
    anchorEl,
    open,
    onClose,
    options,
    offset,
    invertColors = false,
  }: MenuProps) => {
    const { isFullscreen } = useAppStore();
    const [documentEl, setDocumentEl] = useState<Document | null>(null);

    useEffect(() => {
      if (document) {
        setDocumentEl(document);
      }
    }, []);

    const StyledMenu = styled((props: MuiMenuProps) => <MuiMenu {...props} />)(() => ({
      "& .MuiPaper-root": {
        backdropFilter: "blur(10px)",
        backgroundColor: invertColors ? "var(--color-primary-opacity)" : "var(--color-white)",
        color: invertColors ? "var(--color-white)" : "var(--color-primary-opacity)",
        borderRadius: 10,
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

    return (
      <StyledMenu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        // This is a workaround to fix the menu positioning issue when the app is in fullscreen mode
        container={
          isFullscreen
            ? documentEl?.querySelector(".fullscreen")
            : documentEl?.querySelector("#melofi-app")
        }
        aria-hidden={false}
        style={{
          transform: `translateY(${offset ?? 0}px)`,
        }}
      >
        {options?.map((option) => (
          <MenuItem id={option.id} key={option.label} onClick={option.onClick}>
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText primary={option.label} />
            {option.showPremiumIcon && (
              <PiCrownSimpleFill
                size={15}
                color="var(--color-effect-opacity)"
                style={{ marginLeft: 5 }}
              />
            )}
          </MenuItem>
        ))}
      </StyledMenu>
    );
  }
);

export default Menu;
