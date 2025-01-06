import React, { useCallback, useEffect, useState } from "react";
import useCalculatorStore from "@/stores/widgets/calculator-store";
import Modal from "@/ui/components/shared/modal/Modal";
import styles from "./calculator.module.css";
import CalculatorButton from "./components/CalculatorButton";
import { LiaTimesSolid, BsBackspace } from "@/imports/icons";

const DISPLAY_LENGTH_FONT_SIZES: Record<number, string> = {
  9: "2rem",
  10: "1.8rem",
  11: "1.6rem",
  12: "1.4rem",
};

// Utility function to calculate font size
const calculateFontSize = (
  length: number,
  fontSizes: Record<number, string>,
  defaultSize: string
) => {
  if (length > 11) {
    return "1.4rem";
  }
  return fontSizes[length] || defaultSize;
};

// Extracted keyboard input handling logic
const handleKeyPress = (
  e: KeyboardEvent,
  { solveEquation, backspace, clearDisplay, setDisplay }: any
) => {
  if (e.key === "Enter") solveEquation();
  if (e.key === "Backspace") backspace();
  if (e.key === "Escape") clearDisplay();

  const keyMap: Record<string, string> = {
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "0": "0",
    ".": ".",
    "+": "+",
    "-": "-",
    "*": "×",
    "/": "÷",
  };

  if (keyMap[e.key]) setDisplay(keyMap[e.key]);
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

  // Handle keyboard input
  const handleButtonPress = useCallback(
    (e: KeyboardEvent) => handleKeyPress(e, { solveEquation, backspace, clearDisplay, setDisplay }),
    [solveEquation, backspace, clearDisplay, setDisplay]
  );

  useEffect(() => {
    const widget = document.getElementById("calculator-widget");
    widget?.addEventListener("keydown", handleButtonPress);
    return () => {
      widget?.removeEventListener("keydown", handleButtonPress);
    };
  }, [handleButtonPress]);

  useEffect(() => {
    setDisplayFontSize(calculateFontSize(display.length, DISPLAY_LENGTH_FONT_SIZES, "2rem"));
  }, [display]);

  useEffect(() => {
    if (previousEquation) {
      const fontSize = previousEquation.length > 9 ? "1.2rem" : "1.4rem";
      setPreviousEquationFontSize(fontSize);
    }
  }, [previousEquation]);

  const renderButtons = () => {
    const numberButtons = ["7", "8", "9", "4", "5", "6", "1", "2", "3"];
    const operatorButtons = [
      { id: "divide", display: "÷", action: () => setDisplay("÷") },
      { id: "multiply", display: <LiaTimesSolid size={20} />, action: () => setDisplay("×") },
      { id: "subtract", display: "-", action: () => setDisplay("-") },
      { id: "add", display: "+", action: () => setDisplay("+") },
      { id: "equals", display: "=", action: solveEquation },
    ];

    return (
      <>
        <div className={styles.calculator__leftSide}>
          <div className={styles.calculator__buttonRow}>
            <CalculatorButton
              id="clear"
              display="AC"
              backgroundColor="var(--color-secondary)"
              onClick={clearDisplay}
            />
            <CalculatorButton
              id="sign-change"
              display="+/-"
              backgroundColor="var(--color-secondary)"
              onClick={signChange}
            />
            <CalculatorButton id="percent" display="%" backgroundColor="var(--color-secondary)" />
          </div>
          <div className={styles.calculator__numberButtons}>
            {numberButtons.map((num) => (
              <CalculatorButton
                key={num}
                id={num}
                display={num}
                backgroundColor="var(--color-secondary-opacity)"
              />
            ))}
            <CalculatorButton
              id="backspace"
              display={<BsBackspace size={20} />}
              backgroundColor="var(--color-secondary-opacity)"
              onClick={backspace}
            />
            <CalculatorButton id="0" display="0" backgroundColor="var(--color-secondary-opacity)" />
            <CalculatorButton
              id="dot"
              display="."
              backgroundColor="var(--color-secondary-opacity)"
            />
          </div>
        </div>
        <div className={styles.calculator__rightSide}>
          {operatorButtons.map(({ id, display, action }) => (
            <CalculatorButton
              key={id}
              id={id}
              display={display}
              backgroundColor="var(--color-effect-opacity)"
              size="20px"
              onClick={action}
            />
          ))}
        </div>
      </>
    );
  };

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
              id="calculator-previous-equation-text"
              style={{ fontSize: previousEquationFontSize }}
            >
              {previousEquation}
            </p>
          </div>
          <div className={styles.calculator__display}>
            <p id="calculator-display-text" style={{ fontSize: displayFontSize }}>
              {display}
            </p>
          </div>
        </div>
        <div className={styles.calculator__buttons}>{renderButtons()}</div>
      </div>
    </Modal>
  );
};

export default Calculator;
