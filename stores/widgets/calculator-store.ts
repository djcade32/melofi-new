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
  isCalculatorOpen: false,
  fullEquation: "0",
  previousEquation: undefined,
  equationArray: [],
  display: "0",

  setIsCalculatorOpen: (isOpen) => set({ isCalculatorOpen: isOpen }),

  setDisplay: (newText) => {
    const { display, fullEquation, previousEquation } = get();

    const operatorInUse = lastCharacterIsOperator(display);

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
      const lastKnownNumber: string = getLastNumber(display);

      const lastCharIsParanthese = display[display.length - 1] === ")";
      if (lastCharIsParanthese && newText === ".") {
        newDisplay = display + "×0.";
        newFullEquation = fullEquation + "×0.";
        set({
          fullEquation: newFullEquation,
        });
      } else if (lastCharIsParanthese && !checkIfOperator(newText) && newText !== "%") {
        newText = newText === "." && lastKnownNumber.includes("%") ? "0." : newText;
        newDisplay = display + "×" + newText;
        newFullEquation = fullEquation + "×" + newText;
        set({
          fullEquation: newFullEquation,
        });
      } else if (
        (newText === "." && checkIfOperator(lastKnownNumber)) ||
        (newText === "." && lastKnownNumber[lastKnownNumber.length - 1] === "%")
      ) {
        newDisplay = display + "0.";
        newFullEquation = fullEquation + "0.";
        set({
          fullEquation: newFullEquation,
        });
      } else if (
        (newText === "%" && lastKnownNumber.includes("%")) ||
        (lastKnownNumber.includes(".") && newText === ".")
      ) {
        return;
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
      const fullEquationNumberRemoved = fullEquation.slice(0, -getLastNumber(display).length);

      let newDisplay = "";
      if (fullEquationNumberRemoved.length > 10) {
        newDisplay = fullEquationNumberRemoved.slice(-10);
      } else {
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
    const { display, fullEquation, previousEquation } = get();

    if (previousEquation) set({ previousEquation: undefined });
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
    if (checkIfOperator(lastKnownNumber)) return;
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
    console.log("processedResult: ", processedResult);

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

    let resTotal = resArr.shift() as number | string;
    let prevNum: string | number | undefined = resTotal;

    if (typeof resTotal === "string" && resTotal.includes("%")) {
      resTotal = parseFloat(resTotal.replace("%", "")) / 100;
    }

    while (resArr.length >= 1) {
      const num = resArr.shift();
      const operator = opArr.shift() as string;
      console.log("prevNum: ", prevNum);
      if (operator === "+") {
        if (typeof num === "string" && num.includes("%") && typeof resTotal === "number") {
          if (typeof prevNum === "string" && prevNum.includes("%")) {
            console.log("prevNum is percentage");
            resTotal += parseFloat(num.replace("%", "")) / 100;
          } else {
            resTotal += resTotal * (parseFloat(num.replace("%", "")) / 100);
          }
        } else if (typeof num === "number" && typeof resTotal === "number") {
          resTotal += num;
        }
      } else {
        if (typeof num === "string" && num.includes("%") && typeof resTotal === "number") {
          if (typeof prevNum === "string" && prevNum.includes("%")) {
            resTotal -= parseFloat(num.replace("%", "")) / 100;
          } else {
            resTotal -= resTotal * (parseFloat(num.replace("%", "")) / 100);
          }
        } else if (typeof num === "number" && typeof resTotal === "number") {
          resTotal -= num;
        }
      }
      prevNum = num;
    }

    // Round the result to 2 decimal places if repeating digits are found
    resTotal = fixNumber(resTotal as number);

    if (resTotal.toString().length > 10 && typeof resTotal === "number") {
      console.log("resTotal: ", resTotal);
      // Make room for the negative sign
      if (resTotal < 0) {
        resTotal = resTotal.toString();
        resTotal = resTotal.slice(0, 10);
      } else {
        resTotal = resTotal.toPrecision(10);
        resTotal = resTotal.toString().slice(0, 10);
      }

      console.log("resTotal after: ", resTotal);
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

const IS_MOD_REGEX =
  /\(-?\d+(\.\d+)?\)%\(-?\d+(\.\d+)?\)|\(-?\d+(\.\d+)?\)%\d+(\.\d+)?|\d+(\.\d+)?%\(-?\d+(\.\d+)?\)|\d+(\.\d+)?%\d+(\.\d+)?/;

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
  const additionalRegex =
    /\(-\d*\.?\d*%?\)%?|\(-\.\d+%?\)|\(-\d+%?\)|\d\.\d?%|\d+\.\d*|\.\d+%?|\d+%?|[+\-×÷]/g;
  const processedResultRegex = new RegExp(`${IS_MOD_REGEX.source}|${additionalRegex.source}`, "g");

  const rawResult = fullEquation.match(
    processedResultRegex
    // /-?\d+(\.\d+)?%-?\d+(\.\d+)?|\(-\d*\.?\d*%?\)%?|\(-\.\d+%?\)|\(-\d+%?\)|\d\.\d?%|\d+\.\d*|\.\d+%?|\d+%?|[+\-×÷]/g
  );

  if (!rawResult) return [];
  const processedResult = [];

  // Handle special case where the only number is negative with a percentage
  // if (rawResult[0] === "-" && rawResult.length === 2) {
  //   processedResult.push(-parseFloat(rawResult[1]) / 100);
  //   return processedResult;
  // }
  console.log("rawResult: ", rawResult);

  for (let idx = 0; idx < rawResult.length; idx++) {
    const token = rawResult[idx];
    console.log("idx: ", idx);
    console.log("token: ", token);
    console.log("processedResult in for: ", processedResult);

    // Handle mod operation
    if (!!detectModOperation(token)) {
      const { num1, num2 } = detectModOperation(token) as ModOperation;
      processedResult.push(performModOperation(num1, num2));
      continue;
    }

    if (token.includes("(") && token.includes(")")) {
      //TODO: Handle parentheses with percentages
      // Handle numbers inside parentheses
      console.log("token with parentheses: ", token);
      const number = parseFloat(token.replace(/[()%]|[(%)]/g, "")); // Remove parentheses and parse number
      console.log("number: ", number);
      if (token.includes("%")) {
        const isOnlyNumber = rawResult.length === 1;
        processedResult.push(isOnlyNumber ? number / 100 : `${number}%`);
      } else {
        processedResult.push(number);
      }
    } else if (
      (token === "-" && checkIfOperator(processedResult[processedResult.length - 1])) ||
      (token === "-" && idx === 0)
    ) {
      console.log("token is minus sign");
      console.log("rawResult[idx + 1]: ", `-${rawResult[idx + 1]}`);
      // Handle negative numbers
      let num = rawResult[idx + 1].includes("%")
        ? `-${rawResult[idx + 1]}`
        : parseFloat(rawResult[idx + 1]) * -1;

      // Handle Mods with negative numbers
      if (!!detectModOperation(num)) {
        const { num1, num2 } = detectModOperation(num) as ModOperation;
        num = performModOperation(num1, num2);
      }

      processedResult.push(num);
      idx++;
    } else {
      // Push other tokens (numbers and operators) directly
      processedResult.push(isNaN(token as any) ? token : parseFloat(token));
    }
  }
  // console.log("processedResult: ", processedResult);
  return processedResult;
};

const getLastNumber = (display: string): string => {
  // const input = "3+(-9)%";

  // console.log(
  //   "rawResult: ",
  //   input.match(
  //     /\(-\d*\.?\d*%?\)%?|\(-\.\d+%?\)|\(-\d+%?\)|\d\.\d?%|\d+\.\d*|\.\d+%?|\d+%?|[+\-×÷]/g
  //   )
  // );
  const rawResult = display.match(
    /\(-\d*\.?\d*%?\)%?|\(-\.\d+%?\)|\(-\d+%?\)|\d\.\d?%|\d+\.\d*|\.\d+%?|\d+%?|[+\-×÷]/g
  );

  return rawResult ? rawResult[rawResult.length - 1] : "";
};

const fixNumber = (num: number): number => {
  // Convert the number to a string
  const numStr = num.toString();

  // Match the decimal part to check for repeating digits
  const match = numStr.match(/\.\d{2}(\d)\1{2,}/); // Detect 3 or more repeating digits after the 4th decimal place

  if (match && match[1] !== "0") {
    // If repeating digits are found, round to 2 decimal places
    return parseFloat(num.toFixed(2));
  }

  // If no repeating digits are found, keep the number as is
  return num;
};

const performModOperation = (num1: number, num2: number): number => {
  return num1 % num2;
};

const detectModOperation = (token: number | string): ModOperation | null => {
  const match = token.toString().match(IS_MOD_REGEX);
  if (match) {
    const [num1, num2] = token.toString().split("%");
    let num1Parsed = 0;
    let num2Parsed = 0;
    if (num1.includes("(") && num1.includes(")")) {
      num1Parsed = parseFloat(num1.replace(/[()]/g, ""));
      num2Parsed = parseFloat(num2.replace(/[()]/g, ""));
    } else {
      num1Parsed = parseFloat(num1);
      num2Parsed = parseFloat(num2);
    }
    console.log("num1Parsed: ", num1Parsed);
    console.log("num2Parsed: ", num2Parsed);
    return { num1: num1Parsed, num2: num2Parsed };
  }
  return null;
};

interface ModOperation {
  num1: number;
  num2: number;
}

export default useCalculatorStore;
