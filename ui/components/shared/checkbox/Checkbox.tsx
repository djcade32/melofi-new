import React, { useState } from "react";
import { MdOutlineCheckBoxOutlineBlank, MdCheckBox } from "@/imports/icons";
import styles from "./checkbox.module.css";

interface CheckboxProps {
  id: string;
  text: string;
  onClick: () => void;

  textClassName?: string;
  value?: boolean;
}

const Checkbox = ({ id, text, onClick, textClassName, value }: CheckboxProps) => {
  const [checked, setChecked] = useState(value ?? false);
  const handleClick = () => {
    setChecked((prev) => !prev);
    onClick();
  };
  return (
    <div id={id} className={`${styles.checkbox__container} `} onClick={handleClick}>
      {checked ? (
        <MdCheckBox size={25} color="var(--color-effect)" />
      ) : (
        <MdOutlineCheckBoxOutlineBlank size={25} />
      )}
      <p className={textClassName}>{text}</p>
    </div>
  );
};

export default Checkbox;
