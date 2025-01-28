import React from "react";
import Menu from "@/ui/components/shared/menu/Menu";
import { MenuOption } from "@/types/general";
import {
  FaCommentDots,
  FaUserAlt,
  MdSettings,
  FaHandsHelping,
  BsFillInfoCircleFill,
  BsFillGiftFill,
} from "@/imports/icons";
import useMenuStore from "@/stores/menu-store";

const MenuModal = () => {
  const { anchorEl, handleClose, isMenuOpen } = useMenuStore();

  const options: MenuOption[] = [
    {
      id: "menu-option-1",
      label: "Account",
      icon: <FaUserAlt size={20} color="var(--color-white)" />,
      onClick: () => {
        handleClose();
      },
    },
    {
      id: "menu-option-2",
      label: "General Settings",
      icon: <MdSettings size={20} color="var(--color-white)" />,
      onClick: () => {
        handleClose();
      },
    },
    {
      id: "menu-option-3",
      label: "Leave Feedback",
      icon: <FaCommentDots size={20} color="var(--color-white)" />,
      onClick: () => {
        handleClose();
      },
    },
    {
      id: "menu-option-4",
      label: "Support",
      icon: <FaHandsHelping size={20} color="var(--color-white)" />,
      onClick: () => {
        handleClose();
      },
    },
    {
      id: "menu-option-5",
      label: "Share With Friends",
      icon: <BsFillGiftFill size={20} color="var(--color-white)" />,
      onClick: () => {
        handleClose();
      },
    },
    {
      id: "menu-option-6",
      label: "About Melofi",
      icon: <BsFillInfoCircleFill size={20} color="var(--color-white)" />,
      onClick: () => {
        handleClose();
      },
    },
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      open={isMenuOpen}
      onClose={handleClose}
      options={options}
      offset={10}
      invertColors
    />
  );
};

export default MenuModal;
