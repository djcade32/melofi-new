"use client";

import React, { useState } from "react";
import styles from "./toolbarButton.module.css";
import { IconType } from "react-icons";
import Tooltip from "@/ui/components/shared/tooltip/Tooltip";
import useToolsStore from "@/stores/tools-store";
import { PiCrownSimpleFill } from "@/imports/icons";
import useUserStore from "@/stores/user-store";
import useAppStore from "@/stores/app-store";
import { getPremiumModalType } from "@/utils/general";
import useMenuStore from "@/stores/menu-store";

interface ToolbarButtonProps {
  id: string;
  icon: IconType;
  label: string;
  onClick: () => void;
  active: boolean;
  premiumWidget?: boolean;
}

const ToolbarButton = ({
  id,
  icon: Icon,
  label,
  onClick,
  active,
  premiumWidget = false,
}: ToolbarButtonProps) => {
  // const { setShowPremiumModal } = useAppStore();
  const { isVertical, toggleTools } = useToolsStore();
  const [isHovered, setIsHovered] = useState(false);
  const { isPremiumUser, isUserLoggedIn } = useUserStore();
  const { setSelectedOption } = useMenuStore();

  const getIconColor = () => {
    if (active && !isHovered) {
      return "var(--color-effect-opacity)";
    }
    return "var(--color-white)";
  };

  const showPremiumIcon = () => {
    // return premiumWidget && !isPremiumUser;
    return premiumWidget && !isUserLoggedIn;
  };

  const handleOnClick = () => {
    if (showPremiumIcon()) {
      // setShowPremiumModal(getPremiumModalType(label));
      setSelectedOption("Account");
      toggleTools(false);
    } else {
      onClick();
    }
  };

  return (
    <div
      id={`${id}-widget-button`}
      className={styles.toolbarButton__container}
      onClick={handleOnClick}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <Tooltip
        placement={isVertical ? "left" : "bottom"}
        text={label}
        isPremiumTooltip={showPremiumIcon()}
      >
        {React.createElement(Icon, {
          className: styles.toolbarButton__widget_icon,
          size: 30,
          color: getIconColor(),
        })}
      </Tooltip>
      {showPremiumIcon() && !isHovered && (
        <PiCrownSimpleFill className={styles.toolbarButton__premiumWidget} size={15} />
      )}
    </div>
  );
};

export default ToolbarButton;
