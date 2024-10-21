import React, { useState } from "react";
import styles from "./hoverIcon.module.css";
import { IconType } from "react-icons";
import Tooltip from "../tooltip/Tooltip";

interface HoverIconProps {
  icon: IconType;
  size: number;

  id?: string;
  showTooltip?: boolean;
  tooltipText?: string;
  iconStyle?: React.CSSProperties;
  hoverColor?: string;
  color?: string;
  onClick?: () => void;
}

const HoverIcon = ({
  icon,
  size,
  id,
  showTooltip = false,
  tooltipText = "",
  iconStyle,
  hoverColor,
  color = "var(--color-secondary-white)",
  onClick,
}: HoverIconProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      {showTooltip ? (
        <Tooltip text={tooltipText}>
          <div
            id={id}
            className={styles.hoverIcon__iconContainer}
            onClick={onClick}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {React.createElement(icon, {
              style: { ...iconStyle },
              color: isHovered ? hoverColor : color,
              size: size,
            })}
          </div>
        </Tooltip>
      ) : (
        <div
          id={id}
          className={styles.hoverIcon__iconContainer}
          onClick={onClick}
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {React.createElement(icon, {
            style: { ...iconStyle },
            color: isHovered ? hoverColor : color,
            size: size,
          })}
        </div>
      )}
    </>
  );
};

export default HoverIcon;
