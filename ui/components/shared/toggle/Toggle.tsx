import React from "react";
import styles from "./toggle.module.css";

interface ToggleProps {
  values: string[];
  selected: string;
  onChange: (value: string) => void;
  toggleContainerStyle?: React.CSSProperties;
  toggleButtonStyle?: React.CSSProperties;
}

const Toggle = ({
  values,
  selected,
  onChange,
  toggleContainerStyle,
  toggleButtonStyle,
}: ToggleProps) => {
  const handleToggle = (value: string) => {
    onChange(value);
  };
  return (
    <div className={styles.toggle__container} style={{ ...toggleContainerStyle }}>
      <div
        className={selected === values[0] ? styles.selected : ""}
        onClick={handleToggle.bind(null, values[0])}
        style={selected === values[0] ? { ...toggleButtonStyle } : {}}
      >
        <p>{values[0]}</p>
      </div>
      <div
        className={selected === values[1] ? styles.selected : ""}
        onClick={handleToggle.bind(null, values[1])}
        style={selected === values[1] ? { ...toggleButtonStyle } : {}}
      >
        <p>{values[1]}</p>
      </div>
    </div>
  );
};

export default Toggle;
