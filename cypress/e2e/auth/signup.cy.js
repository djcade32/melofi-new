import { ERROR_MESSAGES, navigateToMelofi } from "../../utils/general.ts";
import "cypress-real-events/support.js";

describe("Testing Auth Flow", () => {
  before(() => {
    navigateToMelofi({
      loggedIn: false,
      clearLocalStorage: true,
      seedWithUser: true,
    });
  });

  after(() => {
    cy.clearAuthEmulator();
  });

  describe("Testing signup Form", () => {
    it("Should show signup form", () => {
      cy.get('[class*="signup__title"]').contains("Your Lo-fi Journey Begins Here");
      cy.get('[class*="signup__subtitle"]').contains("What should we call you?");
      cy.get("#sign-up-button").should("exist");
    });

    it("Should show users first name", () => {
      cy.get("[name=first-name]").click();
      cy.get("[name=first-name]").type("John");
      cy.get("input").should("have.value", "John");
    });

    it("Should continue to Credentials View", () => {
      cy.get("#sign-up-button").click();

      cy.get('[class*="signup__title"]').contains("Your Access to Lo-fi Focus Awaits");
      cy.get('[class*="signup__subtitle"]').contains(
        "Almost there! Drop your email and a solid password to secure your spot in the Melofi zone."
      );
      cy.get("#back-button").should("exist");

      cy.get("[name=email]").should("exist");
      cy.get("[name=password]").should("exist");

      cy.get("#sign-up-button").should("exist");
      cy.get("#skip-and-continue").should("exist");
    });

    describe("Signup Form Validation", () => {
      it("Should show error message for empty email and password", () => {
        cy.get("#sign-up-button").click();

        cy.get('[class*="input__error_text"]').contains(ERROR_MESSAGES.EMAIL_REQUIRED);
        cy.get('[class*="input__error_text"]').contains(ERROR_MESSAGES.PASSWORD_REQUIRED);
      });

      it("Should show error message for invalid email", () => {
        cy.get("[name=email]").click();
        cy.get("[name=email]").type("john");
        cy.get("#sign-up-button").click();

        cy.get('[class*="input__error_text"]').contains(ERROR_MESSAGES.INVALID_EMAIL);
      });

      it("Should show error message for invalid password", () => {
        cy.get("[name=email]").click();
        cy.get("[name=email]").type("{selectall}{backspace}");
        cy.get("[name=email]").type("john.doe@email.com");

        cy.get("[name=password]").click();
        cy.get("[name=password]").type("123");
        cy.get("#sign-up-button").click();
        cy.get('[class*="input__error_text"]').contains(ERROR_MESSAGES.PASSWORD_WEAK);

        cy.get("[name=password]").click();
        cy.get("[name=password]").type("abcd");
        cy.get("#sign-up-button").click();
        cy.get('[class*="input__error_text"]').contains(ERROR_MESSAGES.PASSWORD_WEAK);
      });

      it("Should show error message for existing email", () => {
        cy.get("[name=email]").click();
        // clear the email field
        cy.get("[name=email]").type("{selectall}{backspace}");
        cy.get("[name=email]").type("test@example.com");
        cy.get("[name=password]").click();
        cy.get("[name=password]").type("Password123");

        cy.get("#sign-up-button").click();
        cy.get('[class*="input__error_text"]').contains(ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);
      });
    });

    describe("Signup Form Success", () => {
      it("Should sign user up successfully", () => {
        cy.intercept("POST", "**/identitytoolkit.googleapis.com/v1/accounts:signUp?key=*").as(
          "signUpRequest"
        );
        cy.intercept("POST", "**/identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=*").as(
          "sendEmailVerificationRequest"
        );

        cy.get("[name=email]").click();
        // clear the email field
        cy.get("[name=email]").type("{selectall}{backspace}");
        cy.get("[name=email]").type("john.doe@example.com");
        cy.get("[name=password]").click();
        cy.get("#sign-up-button").click();

        // Check if network request was made
        cy.wait("@signUpRequest").then((interception) => {
          expect(interception.response.statusCode).to.eq(200); // Ensure it returns a success status
          expect(interception.request.url).to.include("localhost:9099"); // Check it's hitting the emulator
        });
        cy.wait("@sendEmailVerificationRequest").then((interception) => {
          expect(interception.response.statusCode).to.eq(200); // Ensure it returns a success status
          expect(interception.request.url).to.include("localhost:9099"); // Check it's hitting the emulator
        });
      });

      it("Should show email verification message", () => {
        cy.get('[class*="signup__title"]').contains("One Last Step to the Melofi Zone!");
        cy.get("#send-reset-link-button").should("exist");
        cy.get("#send-reset-link-button")
          .siblings()
          .contains("Didn’t receive the email? Check your spam folder or");
      });

      it("Should send email verification link when resend verification is clicked", () => {
        cy.intercept("POST", "**/identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=*").as(
          "sendEmailVerificationRequest"
        );

        cy.get("[class*='signup__have_account_text']").click();

        cy.wait("@sendEmailVerificationRequest").then((interception) => {
          expect(interception.response.statusCode).to.eq(200); // Ensure it returns a success status
          expect(interception.request.url).to.include("localhost:9099"); // Check it's hitting the emulator
        });
      });

      it("Should show sign in form", () => {
        cy.get("#send-reset-link-button").click();

        cy.get('[class*="signin__title"]').contains("Welcome Back!");
      });
    });
  });
});
