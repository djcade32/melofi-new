import Tooltip from "@/ui/components/shared/tooltip/Tooltip";
import React, { useEffect, useState } from "react";
import styles from "./actionBarButton.module.css";

interface ActionBarButtonProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: (event: React.MouseEvent<HTMLDivElement> | undefined) => void;

  tooltipShown?: boolean;
  isActive?: boolean;
}

const ActionBarButton = ({
  id,
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

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick(event);
    setIsClicked((prev) => !prev);
  };
  return (
    <div
      id={id}
      className={styles.actionBarButton_container}
      onClick={handleOnClick}
      style={isClicked ? { border: "1px solid var(--color-effect-opacity)" } : {}}
      tabIndex={1}
    >
      <Tooltip text={label} disabled={!tooltipShown}>
        {icon}
      </Tooltip>
    </div>
  );
};

export default ActionBarButton;
