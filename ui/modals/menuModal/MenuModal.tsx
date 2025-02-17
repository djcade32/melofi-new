import React, { useMemo } from "react";
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
import AboutMelofiModal from "./optionModals/aboutMelofiModal/AboutMelofiModal";
import MenuModalBackdrop from "./optionModals/components/menuModalBackdrop/MenuModalBackdrop";
import ShareModal from "./optionModals/shareModal/ShareModal";
import GeneralSettingsModal from "./optionModals/generalSettingsModal/GeneralSettingsModal";
import { useAppContext } from "@/contexts/AppContext";

const MenuModal = () => {
  const { anchorEl, handleClose, isMenuOpen, setSelectedOption, selectedOption, setIsMenuOpen } =
    useMenuStore();
  const { signUserOut, isUserLoggedIn, currentUser } = useUserStore();
  const { isSleep } = useAppContext();

  useMemo(() => {
    if (isSleep) {
      setIsMenuOpen(false);
    }
  }, [isSleep]);

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
      id: "menu-option-7",
      label: "About Melofi",
      icon: <BsFillInfoCircleFill size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("About Melofi");
      },
    },
    {
      id: "menu-option-8",
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

  const showLogoutOption = isUserLoggedIn && currentUser?.authUser?.emailVerified;
  const showBackdrop = () => {
    if (
      selectedOption === "Account" ||
      selectedOption === "About Melofi" ||
      selectedOption === "Share With Friends"
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Menu
        id="menu-modal"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        options={showLogoutOption ? options : options.slice(0, 7)}
        offset={10}
        invertColors
      />
      <GeneralSettingsModal />
      <MenuModalBackdrop open={showBackdrop()}>
        <AccountModal />
        <ShareModal />
        <AboutMelofiModal />
      </MenuModalBackdrop>
    </>
  );
};

export default MenuModal;
