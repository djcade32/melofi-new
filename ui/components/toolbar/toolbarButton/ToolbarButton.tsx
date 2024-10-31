"use client";

import React from "react";
import styles from "./toolbarButton.module.css";
import { IconBaseProps, IconType } from "react-icons";
import Tooltip from "@/ui/components/shared/tooltip/Tooltip";
import useToolsStore from "@/stores/tools-store";

interface ToolbarButtonProps {
  id: string;
  icon: IconType;
  label: string;
  onClick: () => void;
  iconProps?: IconBaseProps;
}

const ToolbarButton = ({ id, icon: Icon, label, onClick, iconProps }: ToolbarButtonProps) => {
  const { isVertical } = useToolsStore();
  return (
    <div id={`${id}-widget-button`} className={styles.toolbarButton__container} onClick={onClick}>
      <Tooltip placement={isVertical ? "left" : "bottom"} text={label}>
        {React.createElement(Icon, { ...iconProps })}
      </Tooltip>
    </div>
  );
};

export default ToolbarButton;
