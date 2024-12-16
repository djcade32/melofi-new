"use client";

import React, { useState } from "react";
import styles from "./toolbarButton.module.css";
import { IconType } from "react-icons";
import Tooltip from "@/ui/components/shared/tooltip/Tooltip";
import useToolsStore from "@/stores/tools-store";

interface ToolbarButtonProps {
  id: string;
  icon: IconType;
  label: string;
  onClick: () => void;
  active: boolean;
}

const ToolbarButton = ({ id, icon: Icon, label, onClick, active }: ToolbarButtonProps) => {
  const { isVertical } = useToolsStore();
  const [isHovered, setIsHovered] = useState(false);

  const getIconColor = () => {
    if (active && !isHovered) {
      return "var(--color-effect-opacity)";
    }
    return "var(--color-white)";
  };

  return (
    <div
      id={`${id}-widget-button`}
      className={styles.toolbarButton__container}
      onClick={onClick}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <Tooltip placement={isVertical ? "left" : "bottom"} text={label}>
        {React.createElement(Icon, {
          size: 30,
          color: getIconColor(),
        })}
      </Tooltip>
    </div>
  );
};

export default ToolbarButton;
