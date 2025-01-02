import { create } from "zustand";

export interface CalculatorState {
  isCalculatorOpen: boolean;
  fullEquation: string;
  previousEquation: string | undefined;
  equationArray: string[];
  display: string;

  setIsCalculatorOpen: (isOpen: boolean) => void;
  setDisplay: (display: string) => void;
  addToEquationArray: (newText: string) => void;
  clearDisplay: () => void;
  backspace: () => void;
  signChange: () => void;
  solveEquation: () => void;
  usePreviousEquation: () => void;
}

const useCalculatorStore = create<CalculatorState>((set, get) => ({
  isCalculatorOpen: true,
  fullEquation: "0",
  previousEquation: undefined,
  equationArray: [],
  display: "0",

  setIsCalculatorOpen: (isOpen) => set({ isCalculatorOpen: isOpen }),

  setDisplay: (newText) => {
    const { display, fullEquation, previousEquation } = get();

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

    // Check if there is a previous equation
    if (previousEquation) {
      let newDisplay = newText;
      let newFullEquation = newText;

      if (checkIfOperator(newText) || newText === "%") {
        newDisplay = display + newText;
        newFullEquation = fullEquation + newText;
      }

      set({
        display: newDisplay,
        fullEquation: newFullEquation,
        previousEquation: undefined,
      });
      return;
    }

    let newDisplay = "";
    let newFullEquation = "";
    // If an operator is already in use, replace it with the new one
    if ((operatorInUse && checkIfOperator(newText)) || (operatorInUse && newText === "%")) {
      if (
        (operatorInUse === "÷" && newText === "-") ||
        (operatorInUse === "×" && newText === "-")
      ) {
        newDisplay = display + newText;
        newFullEquation = fullEquation + newText;

        set({
          fullEquation: newFullEquation,
        });
      } else {
        // If only character is minus sign, replace it with 0
        if (display.length === 1 && display[0] === "-") {
          newDisplay = "0";
          set({ fullEquation: "0" });
        } else {
          const secondToLastChar = display[display.length - 2];

          if (checkIfOperator(secondToLastChar) && newText === "-") return;
          const num = checkIfOperator(secondToLastChar) ? -2 : -1;

          newDisplay = display.slice(0, num) + newText;
          newFullEquation = fullEquation.slice(0, num) + newText;
          set({ fullEquation: newFullEquation });
        }
      }
    } else {
      // Prevent adding multiple dots or minus signs
      if (operatorInUse === "-" && newText === "-") return;

      // const lastKnownNumber = display.substring(display.length - lastKnownNumberLength);
      const lastKnownNumber = getLastNumber(display);
      if (lastKnownNumber.includes(".") && newText === ".") return;

      const lastCharIsParanthese = display[display.length - 1] === ")";
      if (lastCharIsParanthese && newText === ".") {
        newDisplay = display + "×0.";
        newFullEquation = fullEquation + "×0.";
        set({
          fullEquation: newFullEquation,
        });
      } else if (lastCharIsParanthese && !checkIfOperator(newText) && newText !== "%") {
        newDisplay = display + "×" + newText;
        newFullEquation = fullEquation + "×" + newText;
        set({
          fullEquation: newFullEquation,
        });
      } else {
        newDisplay = display + newText;
        newFullEquation = fullEquation + newText;
        set({
          fullEquation: newFullEquation,
        });
      }
    }

    // Remove the first character if the display is too long
    if (newDisplay.length > 10) {
      newDisplay = newDisplay.slice(1);
    }

    set({ display: newDisplay });
  },

  addToEquationArray: (newText: string) => {
    const { equationArray } = get();
    const newEquationArray = [...equationArray, newText];
    set({ equationArray: newEquationArray });
  },

  clearDisplay: () => set({ display: "0", fullEquation: "0", previousEquation: undefined }),

  backspace: () => {
    const { display, fullEquation } = get();

    if (display === "0") return;
    if (display.length === 1) {
      set({ display: "0", fullEquation: "0" });
      return;
    }
    /* This part of the code is handling a specific scenario when the last character in the display is
    a closing parenthesis `")"`, which means a negative number. */
    if (display[display.length - 1] === ")") {
      // const fullEquationNumberRemoved = fullEquation.slice(0, -lastKnownNumberLength);
      const fullEquationNumberRemoved = fullEquation.slice(0, -getLastNumber(display).length);

      let newDisplay = "";
      if (fullEquationNumberRemoved.length > 10) {
        newDisplay = fullEquationNumberRemoved.slice(-10);
      } else {
        // newDisplay = fullEquationNumberRemoved.slice(0, -1);
        newDisplay = fullEquationNumberRemoved;
      }

      set({
        display: fullEquationNumberRemoved === "" ? "0" : newDisplay,
        fullEquation: fullEquationNumberRemoved === "" ? "0" : fullEquationNumberRemoved,
      });
      return;
    }

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
    const { display, fullEquation } = get();

    if (display === "0" && display.length === 1) return;
    if (display.length === 1 && display[0] === "-") return;
    if (display.length === 2 && display[0] === "-") {
      set({
        display: display.slice(1),
        fullEquation: fullEquation.slice(1),
      });
      return;
    }
    // const lastKnownNumber = display.substring(display.length - lastKnownNumberLength);
    // const numberRemoved = display.slice(0, -lastKnownNumberLength);
    // const fullEquationNumberRemoved = fullEquation.slice(0, -lastKnownNumberLength);
    const lastKnownNumber = getLastNumber(display);
    const numberRemoved = display.slice(0, -lastKnownNumber.length);
    const fullEquationNumberRemoved = fullEquation.slice(0, -lastKnownNumber.length);

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
      });
      return;
    } else if (lastKnownNumber[0] === "-") {
      newDisplay = `${numberRemoved}${lastKnownNumber.slice(1)}`;
      newFullEquation = `${fullEquationNumberRemoved}${lastKnownNumber.slice(1)}`;
      set({
        display: newDisplay,
        fullEquation: newFullEquation,
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
      });
    }
  },

  solveEquation: () => {
    const { fullEquation } = get();

    const processedResult = getProcessedResult(fullEquation);
    // console.log("processedResult: ", processedResult);

    const resArr: (number | string)[] = [];
    const opArr: string[] = [];

    for (let i = 0; i < processedResult.length; i++) {
      const currEl: string | number = processedResult[i];
      checkIfOperator(currEl) ? opArr.push(currEl as string) : resArr.push(currEl);

      if (
        resArr.length >= 2 &&
        opArr.length >= 1 &&
        opArr.length === resArr.length - 1 &&
        (opArr[opArr.length - 1] === "×" || opArr[opArr.length - 1] === "÷")
      ) {
        let num2 = resArr.pop() as number | string;
        let num1 = resArr.pop() as number | string;
        const operator = opArr.pop() as string;
        let res = 0;

        if (typeof num2 === "string" && num2.includes("%")) {
          num2 = parseFloat(num2.replace("%", "")) / 100;
        }
        if (typeof num1 === "string" && num1.includes("%")) {
          num1 = parseFloat(num1.replace("%", "")) / 100;
        }

        if (operator === "×" && typeof num2 === "number" && typeof num1 == "number") {
          res = num1 * num2;
        } else if (operator === "÷" && typeof num2 === "number" && typeof num1 == "number") {
          res = num1 / num2;
        }

        resArr.push(res);
      }
    }

    let resTotal = resArr.shift() as number;
    while (resArr.length >= 1) {
      const num = resArr.shift();
      const operator = opArr.shift() as string;

      if (operator === "+") {
        if (typeof num === "string" && num.includes("%")) {
          resTotal += resTotal * (parseFloat(num.replace("%", "")) / 100);
        } else if (typeof num === "number") {
          resTotal += num;
        }
      } else {
        if (typeof num === "string" && num.includes("%")) {
          resTotal -= resTotal * (parseFloat(num.replace("%", "")) / 100);
        } else if (typeof num === "number") {
          resTotal -= num;
        }
      }
    }

    if (resTotal.toString().length > 10) {
      resTotal = parseFloat(resTotal.toPrecision(10));
    }

    set({
      display: resTotal.toString(),
      fullEquation: resTotal.toString(),
      previousEquation: fullEquation,
    });
  },

  usePreviousEquation: () => {
    const { previousEquation } = get();
    if (previousEquation) {
      set({
        display: previousEquation.length > 10 ? previousEquation.slice(-10) : previousEquation,
        fullEquation: previousEquation,
        previousEquation: undefined,
      });
    }
  },
}));

// Helper functions

const lastCharacterIsOperator = (display: string): string | undefined => {
  const lastChar = display[display.length - 1];
  if (lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
    return lastChar;
  }
};

const checkIfOperator = (char: any): boolean => {
  return char === "+" || char === "-" || char === "×" || char === "÷";
};

const getProcessedResult = (fullEquation: string): (number | string)[] => {
  const rawResult = fullEquation.match(
    /\.\d|\d\.\d|\d\.|\(-\d+\.\d*\)|\d+\.\d*|\(-\d.\d\)|\(-?\d+(\.\d+)?%\)|\d+(\.\d+)?%?|[+\-×÷]/g
  );
  if (!rawResult) return [];
  const processedResult = [];

  // Handle special case where the only number is negative with a percentage
  if (rawResult[0] === "-" && rawResult.length === 2) {
    processedResult.push(-parseFloat(rawResult[1]) / 100);
    return processedResult;
  }

  for (let idx = 0; idx < rawResult.length; idx++) {
    const token = rawResult[idx];
    if (token.includes("(") && token.includes(")")) {
      // Handle numbers inside parentheses
      const number = parseFloat(token.replace(/[()%]/g, "")); // Remove parentheses and parse number
      if (token.includes("%")) {
        // If it's a percentage, convert to decimal
        processedResult.push(number / 100);
      } else {
        processedResult.push(number);
      }
    } else if (
      (token === "-" && checkIfOperator(processedResult[idx - 1])) ||
      (token === "-" && idx === 0)
    ) {
      // Handle negative numbers
      processedResult.push(-rawResult[idx + 1]);
      idx++;
    } else {
      // Push other tokens (numbers and operators) directly
      processedResult.push(isNaN(token as any) ? token : parseFloat(token));
    }
  }
  console.log("processedResult: ", processedResult);
  return processedResult;
};

const getLastNumber = (display: string): string => {
  // const input = "3+.2";
  const rawResult = display.match(
    /\.\d|\d\.\d|\d\.|\(-\d+\.\d*\)|\d+\.\d*|\(-\d.\d\)|\(-?\d+(\.\d+)?%\)|\d+(\.\d+)?%?|[+\-×÷.]/g
  );
  // console.log("rawResult: ", rawResult);

  return rawResult ? rawResult[rawResult.length - 1] : "";
};

export default useCalculatorStore;
