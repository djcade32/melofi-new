import React from "react";
import styles from "./toolsActionBarButton.module.css";
import ActionBarButton from "../actionBarButton/ActionBarButton";
import { AiFillTool } from "@/imports/icons";
import { IconBaseProps } from "react-icons";

interface ToolsActionBarButtonProps {
  id: string;
  iconProps: IconBaseProps;
  onClick: () => void;
  isActive: boolean;
}

const ToolsActionBarButton = ({ id, iconProps, onClick, isActive }: ToolsActionBarButtonProps) => {
  return (
    <div className={styles.toolsActionBarButton__container}>
      <ActionBarButton
        id={id}
        icon={<AiFillTool {...iconProps} />}
        label="Tools"
        onClick={onClick}
        isActive={isActive}
      />
    </div>
  );
};

export default ToolsActionBarButton;
