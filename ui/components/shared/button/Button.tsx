import React from "react";
import styles from "./button.module.css";
import { IconType } from "react-icons";

interface ButtonProps {
  text: string;
  onClick: () => void;

  containerClassName?: string;
  textClassName?: string;
  prependIcon?: IconType;
  postpendIcon?: IconType;
}

const Button = ({
  text,
  onClick,
  containerClassName,
  textClassName,
  prependIcon,
  postpendIcon,
}: ButtonProps) => {
  return (
    <div onClick={onClick} className={`${styles.button__container} ${containerClassName}`}>
      {prependIcon &&
        React.createElement(prependIcon, {
          size: 25,
          color: "var(--color-secondary-white)",
          style: { marginRight: 10 },
        })}
      <p className={textClassName}>{text}</p>
      {postpendIcon &&
        React.createElement(postpendIcon, {
          size: 25,
          color: "var(--color-secondary-white)",
          style: { marginLeft: 10 },
        })}
    </div>
  );
};

export default Button;
