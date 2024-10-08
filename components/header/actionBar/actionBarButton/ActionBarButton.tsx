import Tooltip from "@/components/shared/tooltip/Tooltip";
import React, { useEffect, useState } from "react";
import styles from "./actionBarButton.module.css";

interface ActionBarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;

  tooltipShown?: boolean;
  isActive?: boolean;
}

const ActionBarButton = ({
  icon,
  label,
  onClick,
  tooltipShown = true,
  isActive,
}: ActionBarButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);

  // May cause problems in the future
  useEffect(() => {
    if (!isActive && isClicked) {
      setIsClicked(false);
    }
  }, [isActive]);

  const handleOnClick = () => {
    onClick();
    setIsClicked((prev) => !prev);
  };
  return (
    <div
      id={`actionBarButton-${label}`}
      className={styles.actionBarButton_container}
      onClick={handleOnClick}
      style={isClicked ? { border: "1px solid var(--color-effect-opacity)" } : {}}
    >
      <Tooltip text={label} show={!tooltipShown}>
        {icon}
      </Tooltip>
    </div>
  );
};

export default ActionBarButton;
