import React, { useState } from "react";
import styles from "./hoverIcon.module.css";
import { IconType } from "react-icons";
import Tooltip from "../tooltip/Tooltip";
import { Zoom } from "@mui/material";

interface HoverIconProps {
  icon: IconType;
  size: number;

  id?: string;
  showTooltip?: boolean;
  tooltipText?: string;
  iconStyle?: React.CSSProperties;
  hoverColor?: string;
  color?: string;
  inverted?: boolean;
  invertedBackgroundColor?: string;
  invertedHoverColor?: string;
  onClick?: (e: any) => void;
  iconContainerClassName?: string;
  disabled?: boolean;
  containerClassName?: string;
}

const HoverIcon = ({
  icon,
  size,
  id,
  showTooltip = false,
  tooltipText = "",
  iconStyle,
  hoverColor,
  inverted = false,
  invertedBackgroundColor,
  invertedHoverColor,
  color = "var(--color-white)",
  onClick,
  iconContainerClassName,
  disabled,
  containerClassName,
}: HoverIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIconColor = () => {
    if (inverted) {
      return color;
    } else {
      return isHovered ? hoverColor : color;
    }
  };

  const getBackgroundColor = () => {
    if (disabled) {
      if (inverted) {
        return invertedBackgroundColor ?? "transparent";
      }
      return "transparent";
    }

    if (inverted) {
      return isHovered
        ? invertedHoverColor ?? "var(--color-secondary-opacity)"
        : invertedBackgroundColor ?? "transparent";
    } else {
      return "transparent";
    }
  };

  const handleOnClick = (e: any) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className={`${styles.hoverIcon__container} ${containerClassName}`}>
      {showTooltip ? (
        <Tooltip
          text={tooltipText}
          TransitionComponent={Zoom as React.JSXElementConstructor<React.PropsWithChildren<{}>>}
          noFlex
        >
          <div
            id={id}
            className={`${styles.hoverIcon__iconContainer} ${iconContainerClassName}`}
            onClick={handleOnClick}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              backgroundColor: getBackgroundColor(),
              cursor: disabled ? "default" : "pointer",
            }}
          >
            {React.createElement(icon, {
              style: { ...iconStyle },
              color: getIconColor(),
              size: size,
            })}
          </div>
        </Tooltip>
      ) : (
        <div
          id={id}
          className={`${styles.hoverIcon__iconContainer} ${iconContainerClassName}`}
          onClick={handleOnClick}
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundColor: getBackgroundColor(),
            cursor: disabled ? "default" : "pointer",
          }}
        >
          {React.createElement(icon, {
            style: { ...iconStyle },
            color: getIconColor(),
            size: size,
          })}
        </div>
      )}
    </div>
  );
};

export default HoverIcon;
