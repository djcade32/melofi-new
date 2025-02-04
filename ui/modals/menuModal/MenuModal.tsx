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
  IoStatsChartSharp,
  PiSignOutBold,
} from "@/imports/icons";
import useMenuStore from "@/stores/menu-store";
import { MenuOptionNames } from "@/enums/general";
import AccountModal from "./optionModals/accountModal/AccountModal";
import useUserStore from "@/stores/user-store";

const MenuModal = () => {
  const { anchorEl, handleClose, isMenuOpen, setSelectedOption } = useMenuStore();
  const { signUserOut, isUserLoggedIn } = useUserStore();

  const options: MenuOption[] = [
    {
      id: "menu-option-1",
      label: "Account",
      icon: <FaUserAlt size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("Account");
      },
    },
    {
      id: "menu-option-2",
      label: "Insights",
      icon: <IoStatsChartSharp size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("Insights");
      },
    },
    {
      id: "menu-option-3",
      label: "General Settings",
      icon: <MdSettings size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("General Settings");
      },
    },
    {
      id: "menu-option-4",
      label: "Leave Feedback",
      icon: <FaCommentDots size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("Leave Feedback");
      },
    },
    {
      id: "menu-option-5",
      label: "Support",
      icon: <FaHandsHelping size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("Support");
      },
    },
    {
      id: "menu-option-6",
      label: "Share With Friends",
      icon: <BsFillGiftFill size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("Share With Friends");
      },
    },
    {
      id: "menu-option-6",
      label: "About Melofi",
      icon: <BsFillInfoCircleFill size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("About Melofi");
      },
    },
    {
      id: "menu-option-7",
      label: "Logout",
      icon: <PiSignOutBold size={20} color="var(--color-white)" />,
      onClick: () => {
        signUserOut();
      },
    },
  ];

  const handleMenuClick = (option: MenuOptionNames) => {
    handleClose();
    setSelectedOption(option);
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        options={isUserLoggedIn ? options : options.slice(0, 7)}
        offset={10}
        invertColors
      />

      <AccountModal />
    </>
  );
};

export default MenuModal;
