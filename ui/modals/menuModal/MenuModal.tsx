import React, { lazy, memo, useMemo } from "react";
import Menu from "@/ui/components/shared/menu/Menu";
import { MenuOption } from "@/types/general";
import {
  FaCommentDots,
  FaUserAlt,
  MdSettings,
  BsFillFileEarmarkMusicFill,
  BsFillInfoCircleFill,
  BsFillGiftFill,
  IoStatsChartSharp,
  PiSignOutBold,
  FaDownload,
  BsFillFileEarmarkCodeFill,
} from "@/imports/icons";
import useMenuStore from "@/stores/menu-store";
import { MenuOptionNames } from "@/enums/general";
import useUserStore from "@/stores/user-store";
import MenuModalBackdrop from "./optionModals/components/menuModalBackdrop/MenuModalBackdrop";
import { useAppContext } from "@/contexts/AppContext";
import ComponentLoader from "@/ui/components/shared/componentLoader/ComponentLoader";
import InsightsModal from "./optionModals/insightsModal/InsightsModal";
import useAppStore from "@/stores/app-store";
import ChangeLog from "./optionModals/changeLog/ChangeLog";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("Menu Modal");

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
      label: isUserLoggedIn ? "Account" : "Sign In",
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
        window.open("https://tally.so/r/mKgy5A");
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
          Logger.error("Unknown OS type");
          return;
        }
        const fileExtension = osType === "mac" ? "dmg" : "exe";
        window.open(
          `https://pub-883c6ee85c4c477c966ca224ca5d4b13.r2.dev/${osType}/Melofi-${process.env.NEXT_PUBLIC_MELOFI_VERSION}.${fileExtension}`
        );
      },
    },
    {
      id: "menu-option-submit-song",
      label: "Submit Song",
      icon: <BsFillFileEarmarkMusicFill size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("Submit Song");
        window.open("https://tally.so/r/waax4Z");
      },
    },
    {
      id: "menu-option-change-log",
      label: "Change Log",
      icon: <BsFillFileEarmarkCodeFill size={20} color="var(--color-white)" />,
      onClick: () => {
        handleMenuClick("Change Log");
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
      label: "Sign Out",
      icon: <PiSignOutBold size={20} color="var(--color-white)" />,
      onClick: async () => {
        await signUserOut();
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
      selectedOption === "Insights" ||
      selectedOption === "Change Log"
    ) {
      return true;
    }
    return false;
  };

  const getMenuOptions = () => {
    let optionsToShow = options;
    if (!showLogoutOption) {
      optionsToShow = optionsToShow.filter((option) => option.id !== "menu-option-logout");
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
          isComponentOpen={selectedOption === "Change Log"}
          component={<ChangeLog />}
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
