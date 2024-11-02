import React, { useState } from "react";
import styles from "./button.module.css";
import { IconType } from "react-icons";

interface ButtonProps extends React.HTMLProps<HTMLDivElement> {
  id: string;
  text: string;
  onClick: () => void;

  containerClassName?: string;
  textClassName?: string;
  prependIcon?: IconType;
  postpendIcon?: IconType;
  disable?: boolean;
}

const Button = ({
  id,
  text,
  onClick,
  containerClassName,
  textClassName,
  prependIcon,
  postpendIcon,
  disable = false,
  ...props
}: ButtonProps) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      id={id}
      onClick={onClick}
      className={`${styles.button__container} ${containerClassName} ${
        hover && !disable && styles.button__hover
      } ${disable && styles.button__disabled}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
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
