import React from "react";
import styles from "./calculatorButton.module.css";
import useCalculatorStore from "@/stores/widgets/calculator-store";

interface CalculatorButtonProps {
  display: string | React.ReactNode;
  backgroundColor?: string;
  size?: string;
  onClick?: () => void;
}

const CalculatorButton = ({ display, backgroundColor, size, onClick }: CalculatorButtonProps) => {
  const { setDisplay } = useCalculatorStore();

  const handleOnClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    typeof display === "string" && setDisplay(display);
    // updateCalculatorDisplay(display);
  };

  return (
    <div
      className={styles.calculatorButton__container}
      style={{ backgroundColor, fontSize: size }}
      onClick={handleOnClick}
    >
      <p>{display}</p>
    </div>
  );
};

export default CalculatorButton;
