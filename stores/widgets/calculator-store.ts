import { create } from "zustand";

export interface CalculatorState {
  isCalculatorOpen: boolean;
  fullEquation: string;
  previousEquation: string | undefined;
  display: string;

  setIsCalculatorOpen: (isOpen: boolean) => void;
  setDisplay: (display: string) => void;
  clearDisplay: () => void;
  backspace: () => void;
  signChange: () => void;
  solveEquation: () => void;
  usePreviousEquation: () => void;
}

const INITIAL_STATE = {
  isCalculatorOpen: false,
  fullEquation: "0",
  previousEquation: undefined,
  display: "0",
};

const useCalculatorStore = create<CalculatorState>((set, get) => ({
  ...INITIAL_STATE,

  setIsCalculatorOpen: (isOpen) => set({ isCalculatorOpen: isOpen }),

  setDisplay: (newText) => {
    const { display, fullEquation, previousEquation } = get();
    const operatorInUse = lastCharacterIsOperator(display);

    // Check if there is a previous equation
    if (previousEquation) {
      handleNewInputAfterPrevious(newText, display, fullEquation, set);
      return;
    }

    // Check if first added text is an operator or a number
    if (display === "0") {
      handleInitialInput(newText, set);
      return;
    }

    // If an operator is already in use, replace it with the new one
    if ((operatorInUse && checkIfOperator(newText)) || (operatorInUse && newText === "%")) {
      handleOperatorReplacement(newText, display, fullEquation, set);
    } else {
      handleRegularInput(newText, display, fullEquation, set);
    }
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
    const lastCharIsParenthesis = display[display.length - 1] === ")";
    const fullEquationNumberRemoved = lastCharIsParenthesis
      ? fullEquation.slice(0, -getLastNumber(display).length)
      : fullEquation.slice(0, -1);
    let updatedDisplay = fullEquationNumberRemoved;
    if (fullEquationNumberRemoved.length > 13) {
      updatedDisplay = fullEquationNumberRemoved.slice(-13);
    }
    set({
      display: fullEquationNumberRemoved === "" ? "0" : updatedDisplay,
      fullEquation: fullEquationNumberRemoved === "" ? "0" : fullEquationNumberRemoved,
    });
  },

  signChange: () => {
    const { display, fullEquation, previousEquation } = get();
    const lastKnownNumber = getLastNumber(display);
    if (checkIfOperator(lastKnownNumber)) return;

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
    } else if (lastKnownNumber[0] === "(" && lastKnownNumber[lastKnownNumber.length - 1] === ")") {
      newDisplay = `${numberRemoved}${lastKnownNumber.slice(2, -1)}`;
      newFullEquation = `${fullEquationNumberRemoved}${lastKnownNumber.slice(2, -1)}`;
    } else if (lastKnownNumber[0] === "-") {
      newDisplay = `${numberRemoved}${lastKnownNumber.slice(1)}`;
      newFullEquation = `${fullEquationNumberRemoved}${lastKnownNumber.slice(1)}`;
    } else {
      const lastKnownNumberWithSign = `(-${lastKnownNumber})`;
      newDisplay = `${numberRemoved}${lastKnownNumberWithSign}`;
      newFullEquation = `${fullEquationNumberRemoved}${lastKnownNumberWithSign}`;

      if (newFullEquation.length > 13) {
        newDisplay = newFullEquation.slice(-13);
      }
    }
    set({
      display: newDisplay,
      fullEquation: newFullEquation,
    });
  },

  solveEquation: () => {
    const { fullEquation } = get();

    const processedResult = getProcessedResult(fullEquation);

    const resArr: (number | string)[] = [];
    const opArr: string[] = [];

    const applyOperator = (num1: number, num2: number, operator: string): number => {
      switch (operator) {
        case "×":
          return num1 * num2;
        case "÷":
          return num1 / num2;
        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }
    };

    const parsePercentage = (value: string | number): number =>
      typeof value === "string" && value.includes("%")
        ? parseFloat(value.replace("%", "")) / 100
        : (value as number);

    const handleMultiplicationAndDivision = () => {
      while (
        resArr.length >= 2 &&
        opArr.length >= 1 &&
        opArr.length === resArr.length - 1 &&
        (opArr[opArr.length - 1] === "×" || opArr[opArr.length - 1] === "÷")
      ) {
        let num2 = parsePercentage(resArr.pop() as number | string);
        let num1 = parsePercentage(resArr.pop() as number | string);
        const operator = opArr.pop() as string;

        resArr.push(applyOperator(num1, num2, operator));
      }
    };

    for (const currEl of processedResult) {
      if (checkIfOperator(currEl)) {
        opArr.push(currEl as string);
      } else {
        resArr.push(currEl);
      }

      handleMultiplicationAndDivision();
    }

    let resTotal = resArr.shift() as number | string;
    let prevNum: string | number | undefined = resTotal;
    // Handle if the first number is a percentage
    resTotal = parsePercentage(resTotal);

    const handleAdditionOrSubtraction = (
      res: number,
      num: string | number,
      operator: string,
      prev: string | number | undefined
    ): number => {
      const parsedNum = parsePercentage(num);

      if (typeof num === "string" && num.includes("%")) {
        if (typeof prev === "string" && prev.includes("%")) {
          // Both numbers are percentages, so add or subtract their decimal values directly
          return operator === "+" ? res + parsedNum : res - parsedNum;
        } else {
          // Apply percentage to the total
          return operator === "+" ? res + res * parsedNum : res - res * parsedNum;
        }
      } else if (typeof parsedNum === "number") {
        return operator === "+" ? res + parsedNum : res - parsedNum;
      }

      return res;
    };

    while (resArr.length >= 1) {
      const num = resArr.shift()!;
      const operator = opArr.shift()!;
      resTotal = handleAdditionOrSubtraction(resTotal, num, operator, prevNum);
      prevNum = num;
    }

    resTotal = fixNumber(resTotal);

    if (resTotal.toString().length > 13 && typeof resTotal === "number") {
      resTotal =
        resTotal < 0
          ? parseFloat(resTotal.toString().slice(0, 13))
          : parseFloat(resTotal.toPrecision(13).toString().slice(0, 13));
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
        display: previousEquation.length > 13 ? previousEquation.slice(-13) : previousEquation,
        fullEquation: previousEquation,
        previousEquation: undefined,
      });
    }
  },
}));

const IS_MOD_REGEX =
  /\(-?\d+(\.\d+)?\)%\(-?\d+(\.\d+)?\)|\(-?\d+(\.\d+)?\)%\d+(\.\d+)?|\d+(\.\d+)?%\(-?\d+(\.\d+)?\)|\d+(\.\d+)?%\d+(\.\d+)?/;
const PROCESS_RESULTS_REGEX =
  /\(-\d*\.?\d*%?\)%?|\(-\.\d+%?\)|\(-\d+%?\)|\d\.\d?%|\d+\.\d*|\.\d+%?|\d+%?|[+\-×÷]/g;

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
  const additionalRegex = PROCESS_RESULTS_REGEX;
  const processedResultRegex = new RegExp(`${IS_MOD_REGEX.source}|${additionalRegex.source}`, "g");

  const rawResult = fullEquation.match(processedResultRegex);

  if (!rawResult) return [];
  const processedResult = [];

  for (let idx = 0; idx < rawResult.length; idx++) {
    const token = rawResult[idx];

    // Handle mod operation
    if (!!detectModOperation(token)) {
      const { num1, num2 } = detectModOperation(token) as ModOperation;
      processedResult.push(performModOperation(num1, num2));
      continue;
    }

    // Handle numbers inside parentheses
    if (token.includes("(") && token.includes(")")) {
      const number = parseFloat(token.replace(/[()%]|[(%)]/g, "")); // Remove parentheses and parse number
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
  return processedResult;
};

const getLastNumber = (display: string): string => {
  const rawResult = display.match(PROCESS_RESULTS_REGEX);
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
    return { num1: num1Parsed, num2: num2Parsed };
  }
  return null;
};

const handleNewInputAfterPrevious = (
  input: string,
  display: string,
  fullEquation: string,
  set: any
) => {
  const isOperator = checkIfOperator(input) || input === "%";
  set({
    display: isOperator ? display + input : input,
    fullEquation: isOperator ? fullEquation + input : input,
    previousEquation: undefined,
  });
};

const handleInitialInput = (input: string, set: any) => {
  // Want minus sign to replace 0
  const appendToDisplay =
    (checkIfOperator(input) || input === "%" || input === ".") && input !== "-";
  set({
    display: appendToDisplay ? `0${input}` : input,
    fullEquation: appendToDisplay ? `0${input}` : input,
  });
};

const handleOperatorReplacement = (
  input: string,
  display: string,
  fullEquation: string,
  set: any
) => {
  const operatorInUse = lastCharacterIsOperator(display);
  let updatedDisplay = "";
  let updatedFullEquation = "";
  if (input === "-") {
    const appendToDisplay = operatorInUse === "÷" || operatorInUse === "×";
    updatedDisplay = appendToDisplay ? display + input : display.slice(0, -1) + input;
    updatedFullEquation = appendToDisplay
      ? fullEquation + input
      : fullEquation.slice(0, -1) + input;
  } else {
    if (display.length === 1 && operatorInUse === "-") {
      updatedDisplay = "0";
      updatedFullEquation = "0";
    } else {
      const secondToLastChar = display[display.length - 2];
      const num = checkIfOperator(secondToLastChar) ? -2 : -1;

      updatedDisplay = display.slice(0, num) + input;
      updatedFullEquation = fullEquation.slice(0, num) + input;
    }
  }
  // Remove the first character if the display is too long
  if (updatedDisplay.length > 13) {
    updatedDisplay = updatedDisplay.slice(1);
  }
  set({ display: updatedDisplay, fullEquation: updatedFullEquation });
};

const handleRegularInput = (input: string, display: string, fullEquation: string, set: any) => {
  let updatedDisplay = "";
  let updatedFullEquation = "";
  const lastKnownNumber = getLastNumber(display);
  const lastCharIsParenthesis = display[display.length - 1] === ")";
  const isOperator = checkIfOperator(input);

  if (lastCharIsParenthesis) {
    const isNotOperator = !isOperator && input !== "%";
    input = input === "." ? "0." : input;

    updatedDisplay = isNotOperator ? display + "×" + input : display + input;
    updatedFullEquation = isNotOperator ? fullEquation + "×" + input : fullEquation + input;
  } else if (input === ".") {
    if (lastKnownNumber.includes(".")) return;
    const lastCharIsOperator =
      checkIfOperator(lastKnownNumber) || lastKnownNumber[lastKnownNumber.length - 1] === "%";

    updatedDisplay = lastCharIsOperator ? display + "0." : display + input;
    updatedFullEquation = lastCharIsOperator ? fullEquation + "0." : fullEquation + input;
  } else {
    if (input === "%" && lastKnownNumber.includes("%")) return;
    updatedDisplay = display + input;
    updatedFullEquation = fullEquation + input;
  }
  if (updatedDisplay.length > 13) {
    updatedDisplay = updatedDisplay.slice(1);
  }
  set({ display: updatedDisplay, fullEquation: updatedFullEquation });
};

interface ModOperation {
  num1: number;
  num2: number;
}

export default useCalculatorStore;
