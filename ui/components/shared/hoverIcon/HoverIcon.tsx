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
  containerClassName?: string;
  disabled?: boolean;
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
  containerClassName,
  disabled,
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
    if (disabled) return;

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
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <>
      {showTooltip ? (
        <Tooltip
          text={tooltipText}
          TransitionComponent={Zoom as React.JSXElementConstructor<React.PropsWithChildren<{}>>}
          noFlex
        >
          <div
            id={id}
            className={`${styles.hoverIcon__iconContainer} ${containerClassName}`}
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
          className={`${styles.hoverIcon__iconContainer} ${containerClassName}`}
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
    </>
  );
};

export default HoverIcon;
