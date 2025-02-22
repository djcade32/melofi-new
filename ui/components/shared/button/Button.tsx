import React, { useState } from "react";
import styles from "./button.module.css";
import { IconType } from "react-icons";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

interface ButtonProps extends React.HTMLProps<HTMLDivElement> {
  id: string;
  text: string;
  onClick: (e?: React.MouseEvent<HTMLDivElement>) => Promise<any> | void;

  containerClassName?: string;
  hoverClassName?: string;
  textClassName?: string;
  prependIcon?: IconType;
  postpendIcon?: IconType;
  disable?: boolean;
  showLoadingState?: boolean;
}

const Button = ({
  id,
  text,
  onClick,
  containerClassName,
  textClassName,
  prependIcon,
  postpendIcon,
  hoverClassName,
  disable = false,
  showLoadingState = false,
  ...props
}: ButtonProps) => {
  const [hover, setHover] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const buttonHoverClassName = hoverClassName ? hoverClassName : styles.button__hover;

  const handleOnClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (disable || showLoading) return;
    showLoadingState && setShowLoading(true);
    await onClick(e);
    showLoadingState && setShowLoading(false);
  };

  return (
    <div
      id={id}
      onClick={handleOnClick}
      className={`${styles.button__container} ${containerClassName} ${
        hover && !disable && buttonHoverClassName
      } ${disable && styles.button__disabled}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: disable ? "default" : "pointer" }}
      {...props}
    >
      {!showLoading ? (
        <>
          {prependIcon &&
            React.createElement(prependIcon, {
              size: 25,
              color: "var(--color-white)",
              style: { marginRight: 10 },
            })}
          <p className={textClassName}>{text}</p>
          {postpendIcon &&
            React.createElement(postpendIcon, {
              size: 25,
              color: "var(--color-white)",
              style: { marginLeft: 10 },
            })}
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default Button;
