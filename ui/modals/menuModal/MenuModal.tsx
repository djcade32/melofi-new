import React, { lazy, memo, useMemo } from "react";
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
  FaDownload,
} from "@/imports/icons";
import useMenuStore from "@/stores/menu-store";
import { MenuOptionNames } from "@/enums/general";
import useUserStore from "@/stores/user-store";
import MenuModalBackdrop from "./optionModals/components/menuModalBackdrop/MenuModalBackdrop";
import { useAppContext } from "@/contexts/AppContext";
import ComponentLoader from "@/ui/components/shared/componentLoader/ComponentLoader";
import InsightsModal from "./optionModals/insightsModal/InsightsModal";
import useAppStore from "@/stores/app-store";

const GeneralSettingsModal = lazy(
  () => import("@/ui/modals/menuModal/optionModals/generalSettingsModal/GeneralSettingsModal")
);
const AccountModal = lazy(
  () => import("@/ui/modals/menuModal/optionModals/accountModal/AccountModal")
);
const ShareModal = lazy(() => import("@/ui/modals/menuModal/optionModals/shareModal/ShareModal"));
const AboutMelofiModal = lazy(
  () => import("@/ui/modals/menuModal/optionModals/aboutMelofiModal/AboutMelofiModal")
);

const MenuModal = memo(() => {
  const { anchorEl, handleClose, isMenuOpen, setSelectedOption, selectedOption, setIsMenuOpen } =
    useMenuStore();
  const { signUserOut, isUserLoggedIn, currentUser, membershipType } = useUserStore();
  const { isSleep } = useAppContext();
  const { isElectron } = useAppStore();

  useMemo(() => {
    if (isSleep) {
      setIsMenuOpen(false);
    }
  }, [isSleep]);

  const options: MenuOption[] = [
    {
      id: "menu-option-account",
      label: "Account",
      icon: <FaUserAlt size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("Account");
      },
    },
    {
      id: "menu-option-insights",
      label: "Insights",
      icon: <IoStatsChartSharp size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("Insights");
      },
    },
    {
      id: "menu-option-settings",
      label: "General Settings",
      icon: <MdSettings size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("General Settings");
      },
    },
    {
      id: "menu-option-feedback",
      label: "Leave Feedback",
      icon: <FaCommentDots size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("Leave Feedback");
        window.open("https://tally.so/r/waax4Z");
      },
    },
    {
      id: "menu-option-share",
      label: "Share With Friends",
      icon: <BsFillGiftFill size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("Share With Friends");
      },
    },
    {
      id: "menu-option-download",
      label: "Melofi Desktop",
      icon: <FaDownload size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("Melofi Desktop");
        // Get os type
        const osType = getOsType();
        if (osType === "unknown") {
          console.error("Unknown OS type");
          return;
        }
        const fileExtension = osType === "mac" ? "dmg" : "exe";
        window.open(
          `https://pub-883c6ee85c4c477c966ca224ca5d4b13.r2.dev/${osType}/Melofi-2.0.0.${fileExtension}`
        );
      },
    },
    {
      id: "menu-option-about",
      label: "About Melofi",
      icon: <BsFillInfoCircleFill size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("About Melofi");
      },
    },
    {
      id: "menu-option-logout",
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
      selectedOption === "Share With Friends" ||
      selectedOption === "Insights"
    ) {
      return true;
    }
    return false;
  };

  const getMenuOptions = () => {
    let optionsToShow = options;
    if (!showLogoutOption) {
      optionsToShow = optionsToShow.slice(0, 8);
    }
    if (isElectron() || membershipType !== "lifetime") {
      optionsToShow = optionsToShow.filter((option) => option.id !== "menu-option-download");
    }
    return optionsToShow;
  };

  const getOsType = () => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes("Mac OS X")) {
      return "mac";
    } else if (userAgent.includes("Windows NT")) {
      return "windows";
    } else if (userAgent.includes("Linux")) {
      return "linux";
    }
    return "unknown";
  };

  return (
    <>
      <Menu
        id="menu-modal"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        options={getMenuOptions()}
        offset={10}
        invertColors
      />
      <ComponentLoader
        isComponentOpen={selectedOption === "General Settings"}
        component={<GeneralSettingsModal />}
      />
      <MenuModalBackdrop open={showBackdrop()}>
        <ComponentLoader
          isComponentOpen={selectedOption === "Account"}
          component={<AccountModal />}
        />
        <ComponentLoader
          isComponentOpen={selectedOption === "Insights"}
          component={<InsightsModal />}
        />
        <ComponentLoader
          isComponentOpen={selectedOption === "Share With Friends"}
          component={<ShareModal />}
        />
        <ComponentLoader
          isComponentOpen={selectedOption === "About Melofi"}
          component={<AboutMelofiModal />}
        />
      </MenuModalBackdrop>
    </>
  );
});

export default MenuModal;
