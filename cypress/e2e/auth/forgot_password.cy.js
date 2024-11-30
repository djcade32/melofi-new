import { navigateToMelofi } from "../../utils/general.ts";

describe("Testing Forgot Password form", () => {
  before(() => {
    navigateToMelofi({
      clearLocalStorage: true,
      seedWithUser: true,
    });
  });

  it("Should show forgot password form", () => {
    cy.get('[class*="signup__have_account_text"]').click();
    cy.get('[class*="signin__have_account_text"]').contains("Forgot your password?").click();

    cy.get('[class*="forgotPassword__title"]').contains("Forgot Your Password?");
    cy.get('[class*="forgotPassword__subtitle"]').contains(
      "No worries! Drop your email and we’ll send you a link to reset your password."
    );

    cy.get("[name=email]").should("exist");
    cy.get("#send-reset-link-button").should("exist");
  });

  it("Should send reset link", () => {
    cy.intercept("POST", "**/identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=*").as(
      "sendEmailVerificationRequest"
    );

    cy.get("[name=email]").click();
    cy.get("[name=email]").type("test@example.com");
    cy.get("#send-reset-link-button").click();

    cy.wait("@sendEmailVerificationRequest").then((interception) => {
      expect(interception.response.statusCode).to.eq(200); // Ensure it returns a success status
      expect(interception.request.url).to.include("localhost:9099"); // Check it's hitting the emulator
    });
  });
});
