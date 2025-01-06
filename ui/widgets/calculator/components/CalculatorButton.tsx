import React, { useState } from "react";
import styles from "./calculatorButton.module.css";
import useCalculatorStore from "@/stores/widgets/calculator-store";

interface CalculatorButtonProps {
  id: string;
  display: string | React.ReactNode;
  backgroundColor?: string;
  size?: string;
  onClick?: () => void;
}

const CalculatorButton = ({
  id,
  display,
  backgroundColor,
  size,
  onClick,
}: CalculatorButtonProps) => {
  const { setDisplay } = useCalculatorStore();
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleOnClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    typeof display === "string" && setDisplay(display);
  };

  return (
    <div
      id={`calculator-button-${id}`}
      className={styles.calculatorButton__container}
      style={{
        backgroundColor,
        fontSize: size,
      }}
      onClick={handleOnClick}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      <div
        className={styles.calculatorButton__overlay}
        style={{
          opacity: isMouseDown ? 0.5 : 0,
        }}
      />
      <p>{display}</p>
    </div>
  );
};

export default CalculatorButton;
