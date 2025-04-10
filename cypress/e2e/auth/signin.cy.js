import { ERROR_MESSAGES, navigateToMelofi } from "../../utils/general.ts";

describe("Testing signin Form", () => {
  before(() => {
    cy.clearLocalStorage();
    navigateToMelofi({
      loggedIn: false,
      clearLocalStorage: true,
      seedWithUser: true,
    });
  });

  after(() => {
    cy.clearAuthEmulator();
  });

  it("Should show signin form", () => {
    cy.get('[class*="signup__have_account_text"]').click();

    cy.get('[class*="signin__title"]').contains("Welcome Back!");
    cy.get('[class*="signin__subtitle"]').contains(
      "Log in to tune into your personalized lo-fi focus space."
    );

    cy.get("[name=email-input]").should("exist");
    cy.get("[name=password-input]").should("exist");
    cy.get("#sign-in-button").should("exist");
  });

  describe("Signin Form Validation", () => {
    it("Should show error message for empty email and password", () => {
      cy.get("#sign-in-button").click();

      cy.get('[class*="input__error_text"]').contains(ERROR_MESSAGES.EMAIL_REQUIRED);
      cy.get('[class*="input__error_text"]').contains(ERROR_MESSAGES.PASSWORD_REQUIRED);
    });

    it("Should show error message for invalid credentials", () => {
      cy.get("[name=email-input]").click();
      cy.get("[name=email-input]").type("max@email.com");
      cy.get("[name=password-input]").click();
      cy.get("[name=password-input]").type("123456");

      cy.get("#sign-in-button").click();

      cy.get('[class*="signin__form_error_text"]').contains(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });
  });

  describe("Signin Form Success", () => {
    it("Should signin successfully but navigate to email verification view", () => {
      cy.get("[name=email-input]").click();
      cy.get("[name=email-input]").type("{selectall}{backspace}");
      cy.get("[name=email-input]").type("test@example.com");

      cy.get("[name=password-input]").click();
      cy.get("[name=password-input]").type("{selectall}{backspace}");
      cy.get("[name=password-input]").type("Password123");
      cy.get("#sign-in-button").click();

      cy.get('[class*="signup__title"]').contains("One Last Step to the Melofi Zone!", {
        timeout: 15000,
      });
    });
  });
});
