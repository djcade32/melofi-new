import useCalculatorStore from "@/stores/widgets/calculator-store";
import Modal from "@/ui/components/shared/modal/Modal";
import React, { useCallback, useEffect, useState } from "react";

import styles from "./calculator.module.css";
import CalculatorButton from "./components/CalculatorButton";
import { LiaTimesSolid } from "react-icons/lia";
import { BsBackspace } from "react-icons/bs";

const DISPLAY_LENGTH_FONT_SIZES: Record<number, string> = {
  9: "2rem",
  10: "1.8rem",
  11: "1.6rem",
  12: "1.4rem",
};

const Calculator = () => {
  const {
    isCalculatorOpen,
    setIsCalculatorOpen,
    display,
    backspace,
    clearDisplay,
    setDisplay,
    signChange,
    solveEquation,
    previousEquation,
    usePreviousEquation,
  } = useCalculatorStore();
  const [displayFontSize, setDisplayFontSize] = useState("2rem");
  const [previousEquationFontSize, setPreviousEquationFontSize] = useState("1.4rem");

  const handleButtonPress = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      solveEquation();
    }

    if (e.key === "Backspace") {
      backspace();
    }

    if (e.key === "Escape") {
      clearDisplay();
    }

    switch (e.key) {
      case "1":
        setDisplay("1");
        break;
      case "2":
        setDisplay("2");
        break;
      case "3":
        setDisplay("3");
        break;
      case "4":
        setDisplay("4");
        break;
      case "5":
        setDisplay("5");
        break;
      case "6":
        setDisplay("6");
        break;
      case "7":
        setDisplay("7");
        break;
      case "8":
        setDisplay("8");
        break;
      case "9":
        setDisplay("9");
        break;
      case "0":
        setDisplay("0");
        break;
      case ".":
        setDisplay(".");
        break;
      case "+":
        setDisplay("+");
        break;
      case "-":
        setDisplay("-");
        break;
      case "*":
        setDisplay("×");
        break;
      case "/":
        setDisplay("÷");
    }
  }, []);

  // Focus on the calculator when it's opened
  useEffect(() => {
    isCalculatorOpen && document.getElementById("calculator-widget")?.focus();
  }, [isCalculatorOpen]);

  // Handle keyboard input
  useEffect(() => {
    const widget = document.getElementById("calculator-widget");
    widget?.addEventListener("keydown", handleButtonPress);
    return () => {
      widget?.removeEventListener("keydown", handleButtonPress);
    };
  }, []);

  useEffect(() => {
    if (display.length < 10 && displayFontSize !== "2rem") {
      setDisplayFontSize("2rem");
    } else if (display.length > 11 && displayFontSize !== "1.4rem") {
      setDisplayFontSize("1.4rem");
    }
    const fontSize = DISPLAY_LENGTH_FONT_SIZES[display.length];
    fontSize && setDisplayFontSize(fontSize);
  }, [display]);

  useEffect(() => {
    if (!previousEquation) return;
    const fontSize = previousEquation.length > 9 ? "1.2rem" : "1.4rem";
    setPreviousEquationFontSize(fontSize);
  }, [previousEquation]);

  return (
    <Modal
      id="calculator-widget"
      isOpen={isCalculatorOpen}
      className={styles.calculator__container}
      draggable
      fadeCloseIcon
      close={() => setIsCalculatorOpen(!isCalculatorOpen)}
      tabIndex={0}
    >
      <div>
        <div>
          <div className={styles.calculator__previousEquation} onClick={usePreviousEquation}>
            <p
              style={{
                fontSize: previousEquationFontSize,
              }}
            >
              {previousEquation}
            </p>
          </div>
          <div className={styles.calculator__display}>
            <p
              id="calculatorText"
              style={{
                fontSize: displayFontSize,
              }}
            >
              {display}
            </p>
          </div>
        </div>

        <div className={styles.calculator__buttons}>
          <div className={styles.calculator__leftSide}>
            <div className={styles.calculator__buttonRow}>
              <CalculatorButton
                display="AC"
                backgroundColor="var(--color-secondary)"
                onClick={clearDisplay}
              />
              <CalculatorButton
                display="+/-"
                backgroundColor="var(--color-secondary)"
                onClick={signChange}
              />
              <CalculatorButton display="%" backgroundColor="var(--color-secondary)" />
            </div>
            <div className={styles.calculator__numberButtons}>
              <CalculatorButton display="7" backgroundColor="var(--color-secondary-opacity)" />
              <CalculatorButton display="8" backgroundColor="var(--color-secondary-opacity)" />
              <CalculatorButton display="9" backgroundColor="var(--color-secondary-opacity)" />
              <CalculatorButton display="4" backgroundColor="var(--color-secondary-opacity)" />
              <CalculatorButton display="5" backgroundColor="var(--color-secondary-opacity)" />
              <CalculatorButton display="6" backgroundColor="var(--color-secondary-opacity)" />
              <CalculatorButton display="1" backgroundColor="var(--color-secondary-opacity)" />
              <CalculatorButton display="2" backgroundColor="var(--color-secondary-opacity)" />
              <CalculatorButton display="3" backgroundColor="var(--color-secondary-opacity)" />
              <CalculatorButton
                display={<BsBackspace size={20} />}
                backgroundColor="var(--color-secondary-opacity)"
                onClick={backspace}
              />
              <CalculatorButton display="0" backgroundColor="var(--color-secondary-opacity)" />
              <CalculatorButton display="." backgroundColor="var(--color-secondary-opacity)" />
            </div>
          </div>
          <div className={styles.calculator__rightSide}>
            <CalculatorButton
              display="÷"
              backgroundColor="var(--color-effect-opacity)"
              size="20px"
            />
            <CalculatorButton
              display={<LiaTimesSolid size={20} />}
              backgroundColor="var(--color-effect-opacity)"
              onClick={() => setDisplay("×")}
            />
            <CalculatorButton
              display="-"
              backgroundColor="var(--color-effect-opacity)"
              size="20px"
            />
            <CalculatorButton
              display="+"
              backgroundColor="var(--color-effect-opacity)"
              size="20px"
            />
            <CalculatorButton
              display="="
              backgroundColor="var(--color-effect-opacity)"
              size="20px"
              onClick={solveEquation}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Calculator;
