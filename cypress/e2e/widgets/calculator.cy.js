import { navigateToMelofi } from "../../utils/general.ts";
import { pressToolbarButton, pressToolsButton } from "../../utils/general.ts";
import "cypress-real-events/support.js";

describe("Testing Calculator Widget", () => {
  before(() => {
    navigateToMelofi();
  });
  describe("Testing Basic Functionality", () => {
    it("Should open and close Calculator widget", () => {
      // open the calendar widget
      pressToolsButton();
      pressToolbarButton("calculator");
      cy.get("#calculator-widget").should("exist");
      // close the calendar widget using widget button
      pressToolsButton();
      pressToolbarButton("calculator");
      cy.get("#calculator-widget").should("not.be.visible");
      // open the calendar widget
      pressToolsButton();
      pressToolbarButton("calculator");
      // close the calendar widget using close button
      cy.get("#calculator-widget-close-icon").realClick();
    });

    it("Should be able to perform basic calculations", () => {
      pressToolsButton();
      pressToolbarButton("calculator");
      // Click 1
      cy.get("#calculator-button-1").realClick();
      // Click +
      cy.get("#calculator-button-add").realClick();
      // Click 2
      cy.get("#calculator-button-2").realClick();
      // Check equation is displayed
      cy.get("#calculator-display-text").should("have.text", "1+2");
      // Click =
      cy.get("#calculator-button-equals").realClick();
      // Check for the result
      cy.get("#calculator-display-text").should("have.text", "3");
      // Check previous equation is displayed
      cy.get("#calculator-previous-equation-text").should("have.text", "1+2");
    });

    it("Should be able to clear the calculator", () => {
      // Click C
      cy.get("#calculator-button-clear").realClick();
      // Check for the result
      cy.get("#calculator-display-text").should("have.text", "0");
      // Check previous equation is displayed
      cy.get("#calculator-previous-equation-text").should("have.text", "");
    });

    it("Should be able to backspace", () => {
      // Click 1
      cy.get("#calculator-button-1").realClick();
      // Click +
      cy.get("#calculator-button-add").realClick();
      // Click 2
      cy.get("#calculator-button-2").realClick();
      // Check equation is displayed
      cy.get("#calculator-display-text").should("have.text", "1+2");
      // Click backspace
      cy.get("#calculator-button-backspace").realClick();
      // Check equation is displayed
      cy.get("#calculator-display-text").should("have.text", "1+");
    });

    it("Should be able to use all buttons", () => {
      // Click AC
      cy.get("#calculator-button-clear").realClick();
      // Click 1
      cy.get("#calculator-button-1").realClick();
      // Click 2
      cy.get("#calculator-button-2").realClick();
      // Click .
      cy.get("#calculator-button-dot").realClick();
      // Click +
      cy.get("#calculator-button-add").realClick();
      // Click 3
      cy.get("#calculator-button-3").realClick();
      // Click 4
      cy.get("#calculator-button-4").realClick();
      // Click %
      cy.get("#calculator-button-percent").realClick();
      // Click -
      cy.get("#calculator-button-subtract").realClick();
      // Click 5
      cy.get("#calculator-button-5").realClick();
      // Click 6
      cy.get("#calculator-button-6").realClick();

      cy.get("#calculator-display-text").should("have.text", "12.+34%-56");
      // Click AC
      cy.get("#calculator-button-clear").realClick();

      // Click *
      cy.get("#calculator-button-multiply").realClick();
      // Click 7
      cy.get("#calculator-button-7").realClick();
      // Click 8
      cy.get("#calculator-button-8").realClick();
      // Click /
      cy.get("#calculator-button-divide").realClick();
      // Click 9
      cy.get("#calculator-button-9").realClick();
      // Click 0
      cy.get("#calculator-button-0").realClick();
      // Click -/+
      cy.get("#calculator-button-sign-change").realClick();

      // Check equation is displayed
      cy.get("#calculator-display-text").should("have.text", "0×78÷(-90)");
    });

    it("Should cut off the equation if it is too long", () => {
      // Click 1
      cy.get("#calculator-button-1").realClick();
      // Click 2
      cy.get("#calculator-button-2").realClick();
      // Click 3
      cy.get("#calculator-button-3").realClick();
      // Click 4
      cy.get("#calculator-button-4").realClick();
      // Click 5
      cy.get("#calculator-button-5").realClick();
      // Click 6
      cy.get("#calculator-button-6").realClick();
      // Click 7
      cy.get("#calculator-button-7").realClick();
      // Click 8
      cy.get("#calculator-button-8").realClick();
      // Click 9
      cy.get("#calculator-button-9").realClick();
      // Click +
      cy.get("#calculator-button-add").realClick();
      // Click 1
      cy.get("#calculator-button-1").realClick();
      // Click 2
      cy.get("#calculator-button-2").realClick();
      // Click 3
      cy.get("#calculator-button-3").realClick();
      // Click 4
      cy.get("#calculator-button-4").realClick();

      // Check equation is displayed
      cy.get("#calculator-display-text").should("have.text", "23456789+1234");
    });

    it("Should be able to use the calculator with keyboard", () => {
      // Type esc
      cy.get("body").type("{esc}");
      // Type 1
      cy.get("body").type("1");
      // Type +
      cy.get("body").type("+");
      // Type 2
      cy.get("body").type("2");
      // Check equation is displayed
      cy.get("#calculator-display-text").should("have.text", "1+2");
      // Type backspace
      cy.get("body").type("{backspace}");
      // Check equation is displayed
      cy.get("#calculator-display-text").should("have.text", "1+");
      // Type 2
      cy.get("body").type("2");
      // Type =
      cy.get("body").type("{enter}");
      // Check for the result
      cy.get("#calculator-display-text").should("have.text", "3");
    });
  });
  describe("Testing Complex Arithmetic", () => {
    it("Should solve complex arithmetic", () => {
      const operationMappings = {
        "+": "add",
        "-": "subtract",
        x: "multiply",
        "÷": "divide",
        "%": "percent",
        ".": "dot",
        s: "sign-change",
      };
      const equations = [
        {
          equation: "3÷3+5x1",
          result: "6",
        },
        {
          equation: "3+5x2",
          result: "13",
        },
        {
          equation: "3x3-5÷1",
          result: "4",
        },
        {
          equation: "-3+5-1x3÷2",
          result: "0.5",
        },
        {
          equation: "3.3+3",
          result: "6.3",
        },
        {
          equation: "3.+3",
          result: "6",
        },
        {
          equation: "3.3x-3.3",
          result: "-10.89",
        },
        {
          equation: "3.÷-0.3",
          result: "-10",
        },
        {
          equation: "3%+3%",
          result: "0.06",
        },
        {
          equation: "3%+3",
          result: "3.03",
        },
        {
          equation: "0.3%x0.3%",
          result: "0.000009",
        },
        {
          equation: "-3%-3%",
          result: "-0.06",
        },
        {
          equation: "0.3%÷3",
          result: "0.001",
        },
        {
          equation: "3x3%",
          result: "0.09",
        },
        {
          equation: "3x3%+3",
          result: "3.09",
        },
        {
          equation: "3÷0.3%",
          result: "1000",
        },
        {
          equation: "-3%+3%",
          result: "0",
        },
        {
          equation: "-3.3%÷0.3%",
          result: "-11",
        },
        {
          equation: "0÷3",
          result: "0",
        },
        {
          equation: "0÷3",
          result: "0",
        },
        {
          equation: "3%2",
          result: "1",
        },
      ];

      equations.forEach((equation) => {
        equation.equation.split("").forEach((char) => {
          if (operationMappings[char]) {
            cy.get(`#calculator-button-${operationMappings[char]}`).realClick();
          } else {
            cy.get(`#calculator-button-${char}`).realClick();
          }
        });
        cy.get("#calculator-button-equals").realClick();
        cy.get("#calculator-display-text").should("have.text", equation.result);
        // Click AC
        cy.get("#calculator-button-clear").realClick();
      });
    });
    it("Should show correct format", () => {
      const operationMappings = {
        "+": "add",
        "-": "subtract",
        x: "multiply",
        "÷": "divide",
        "%": "percent",
        ".": "dot",
        s: "sign-change",
      };
      const equations = [
        {
          input: "9+-",
          expected: "9-",
        },
        {
          input: "3..",
          expected: "3.",
        },
        {
          input: "3+.",
          expected: "3+0.",
        },
        {
          input: "3%.",
          expected: "3%0.",
        },
        {
          input: "3+s",
          expected: "3+",
        },
        {
          input: "3+4s",
          expected: "3+(-4)",
        },
        {
          input: "3+4%s",
          expected: "3+(-4%)",
        },
        {
          input: "3+4s3",
          expected: "3+(-4)×3",
        },
        {
          input: "3+4s.",
          expected: "3+(-4)×0.",
        },
      ];

      equations.forEach((equation) => {
        equation.input.split("").forEach((char) => {
          if (operationMappings[char]) {
            cy.get(`#calculator-button-${operationMappings[char]}`).realClick();
          } else {
            cy.get(`#calculator-button-${char}`).realClick();
          }
        });
        cy.get("#calculator-display-text").should("have.text", equation.expected);
        // Click AC
        cy.get("#calculator-button-clear").realClick();
      });
    });
  });
});
