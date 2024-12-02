import React, { useState } from "react";
import { MdOutlineCheckBoxOutlineBlank, MdCheckBox } from "@/imports/icons";
import styles from "./checkbox.module.css";

interface CheckboxProps {
  id: string;
  text: string;
  onClick: () => void;

  centerCheckbox?: boolean;
  ariaLabel?: string;
  textClassName?: string;
  value?: boolean;
  size?: number;
}

const Checkbox = ({
  id,
  text,
  onClick,
  textClassName,
  value,
  ariaLabel,
  centerCheckbox = true,
  size = 25,
}: CheckboxProps) => {
  const [checked, setChecked] = useState(value ?? false);
  const handleClick = () => {
    setChecked((prev) => !prev);
    onClick();
  };
  return (
    <div
      aria-label={ariaLabel}
      id={id}
      className={`${styles.checkbox__container} `}
      style={{ alignItems: centerCheckbox ? "center" : "flex-start" }}
      onClick={handleClick}
    >
      {checked ? (
        <MdCheckBox size={size} color="var(--color-effect)" />
      ) : (
        <MdOutlineCheckBoxOutlineBlank size={size} />
      )}
      <p className={textClassName}>{text}</p>
    </div>
  );
};

export default Checkbox;
