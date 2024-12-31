import { create } from "zustand";

export interface CalculatorState {
  isCalculatorOpen: boolean;
  fullEquation: string;
  display: string;
  lastKnownNumberLength: number;

  setIsCalculatorOpen: (isOpen: boolean) => void;
  setDisplay: (display: string) => void;
  clearDisplay: () => void;
  backspace: () => void;
  signChange: () => void;
}

const useCalculatorStore = create<CalculatorState>((set, get) => ({
  isCalculatorOpen: true,
  fullEquation: "0",
  display: "0",
  lastKnownNumberLength: 1,

  setIsCalculatorOpen: (isOpen) => set({ isCalculatorOpen: isOpen }),
  setDisplay: (newText) => {
    // const calculatorText = document.getElementById("calculatorText");

    // function updateCalculatorDisplay(newInput) {
    //   console.log(calculatorText);
    //   if (!calculatorText) return;
    //   // Add the new input at the end of the text
    //   calculatorText.textContent += newInput;

    //   // Ensure the ellipsis appears only for overflowing content
    //   const parentWidth = calculatorText.parentElement.offsetWidth;
    //   while (calculatorText.scrollWidth > parentWidth) {
    //     // Remove characters from the start of the string
    //     calculatorText.textContent = calculatorText.textContent.slice(1);
    //   }
    // }

    const { display, fullEquation, lastKnownNumberLength } = get();

    const operatorInUse = lastCharacterIsOperator(display);

    // Check if first added text is an operator or a number
    if (display === "0") {
      checkIfOperator(newText) || newText === "%" || newText === "."
        ? set({
            display: newText === "-" ? newText : "0" + newText,
            fullEquation: newText === "-" ? newText : "0" + newText,
          })
        : set({ display: newText, fullEquation: newText });
      return;
    }

    let newDisplay = "";
    let newFullEquation = "";
    // If an operator is already in use, replace it with the new one
    if ((operatorInUse && checkIfOperator(newText)) || (operatorInUse && newText === "%")) {
      if (
        (operatorInUse === "÷" && newText === "-") ||
        (operatorInUse === "x" && newText === "-")
      ) {
        newDisplay = display + newText;
        newFullEquation = fullEquation + newText;
        set({ lastKnownNumberLength: 0, fullEquation: newFullEquation });
      } else {
        const num = checkIfOperator(display[display.length - 2]) ? -2 : -1;

        newDisplay = display.slice(0, num) + newText;
        newFullEquation = fullEquation.slice(0, num) + newText;
        set({ lastKnownNumberLength: 0, fullEquation: newFullEquation });
      }
    } else {
      // Prevent adding multiple dots or minus signs
      if (operatorInUse === "-" && newText === "-") return;
      const lastKnownNumber = display.substring(display.length - lastKnownNumberLength);
      if (lastKnownNumber.includes(".") && newText === ".") return;

      newDisplay = display + newText;
      newFullEquation = fullEquation + newText;
      set({
        lastKnownNumberLength: checkIfOperator(newText) ? 0 : lastKnownNumberLength + 1,
        fullEquation: newFullEquation,
      });
    }

    // Remove the first character if the display is too long
    if (newDisplay.length > 10) {
      newDisplay = newDisplay.slice(1);
    }

    set({ display: newDisplay });
  },

  clearDisplay: () => set({ display: "0", fullEquation: "0", lastKnownNumberLength: 1 }),

  backspace: () => {
    const { display, fullEquation, lastKnownNumberLength } = get();

    if (display === "0") return;
    if (display.length === 1) {
      set({ display: "0", fullEquation: "0" });
      return;
    }
    /* This part of the code is handling a specific scenario when the last character in the display is
    a closing parenthesis `")"`, which means a negative number. */
    if (display[display.length - 1] === ")") {
      const fullEquationNumberRemoved = fullEquation.slice(0, -lastKnownNumberLength);

      let newDisplay = "";
      if (fullEquationNumberRemoved.length > 10) {
        newDisplay = fullEquationNumberRemoved.slice(-10);
      } else {
        newDisplay = fullEquationNumberRemoved.slice(0, -1);
      }

      set({
        display: fullEquationNumberRemoved === "" ? "0" : newDisplay,
        fullEquation: fullEquationNumberRemoved === "" ? "0" : fullEquationNumberRemoved,
        lastKnownNumberLength: 0,
      });
      return;
    }

    !lastCharacterIsOperator(display) && set({ lastKnownNumberLength: lastKnownNumberLength - 1 });
    const fullEquationNumberRemoved = fullEquation.slice(0, -1);

    let newDisplay = "";
    if (fullEquationNumberRemoved.length > 10) {
      newDisplay = fullEquationNumberRemoved.slice(-10);
    } else {
      newDisplay = fullEquationNumberRemoved;
    }

    set({ display: newDisplay, fullEquation: fullEquationNumberRemoved });
  },

  signChange: () => {
    const { display, lastKnownNumberLength, fullEquation } = get();

    if (lastKnownNumberLength === 0) return;
    if (display.length === 1 && display[0] === "-") return;
    if (display.length === 2 && display[0] === "-") {
      set({
        display: display.slice(1),
        fullEquation: fullEquation.slice(1),
        lastKnownNumberLength: 1,
      });
      return;
    }
    const lastKnownNumber = display.substring(display.length - lastKnownNumberLength);
    const numberRemoved = display.slice(0, -lastKnownNumberLength);
    const fullEquationNumberRemoved = fullEquation.slice(0, -lastKnownNumberLength);

    let newDisplay = "";
    let newFullEquation = "";

    /* This part of the code snippet is handling the scenario when the user wants to change the sign of
    a number in the calculator display. Here's a breakdown of what each condition is doing:
    1. If the last character in the display is a minus sign, replace it with a plus sign.
    2. If the last character in the display is a negative number, remove the negative sign.
    3. If the last character in the display is a positive number, add a negative sign to it.
    */
    if (numberRemoved[numberRemoved.length - 1] === "-") {
      newDisplay = `${numberRemoved.slice(0, -1)}+${lastKnownNumber}`;
      newFullEquation = `${fullEquationNumberRemoved.slice(0, -1)}+${lastKnownNumber}`;
      set({ display: newDisplay, fullEquation: newFullEquation });
    } else if (lastKnownNumber[0] === "(" && lastKnownNumber[lastKnownNumber.length - 1] === ")") {
      newDisplay = `${numberRemoved}${lastKnownNumber.slice(2, -1)}`;
      newFullEquation = `${fullEquationNumberRemoved}${lastKnownNumber.slice(2, -1)}`;
      set({
        display: newDisplay,
        fullEquation: newFullEquation,
        lastKnownNumberLength: lastKnownNumber.length - 3,
      });
      return;
    } else if (lastKnownNumber[0] === "-") {
      newDisplay = `${numberRemoved}${lastKnownNumber.slice(1)}`;
      newFullEquation = `${fullEquationNumberRemoved}${lastKnownNumber.slice(1)}`;
      set({
        display: newDisplay,
        fullEquation: newFullEquation,
        lastKnownNumberLength: lastKnownNumber.length - 1,
      });
    } else {
      const lastKnownNumberWithSign = `(-${lastKnownNumber})`;
      newDisplay = `${numberRemoved}${lastKnownNumberWithSign}`;
      newFullEquation = `${fullEquationNumberRemoved}${lastKnownNumberWithSign}`;

      if (newFullEquation.length > 10) {
        newDisplay = newFullEquation.slice(-10);
      }

      set({
        display: newDisplay,
        fullEquation: newFullEquation,
        lastKnownNumberLength: lastKnownNumberWithSign.length,
      });
    }
  },
}));

// Helper functions

const lastCharacterIsOperator = (display: string): string | undefined => {
  const lastChar = display[display.length - 1];
  if (lastChar === "+" || lastChar === "-" || lastChar === "x" || lastChar === "÷") {
    return lastChar;
  }
};

const checkIfOperator = (char: string): boolean => {
  return char === "+" || char === "-" || char === "x" || char === "÷";
};

export default useCalculatorStore;
