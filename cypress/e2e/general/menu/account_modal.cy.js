import { navigateToMelofi } from "../../../utils/general.ts";
import { Menu } from "../../pages/Menu.page";

describe("Testing Account Modal", () => {
  after(() => {
    cy.clearLocalStorage();
  });

  describe("Testing Logged In", () => {
    before(() => {
      navigateToMelofi({
        seedWithUser: true,
        skipOnboarding: false,
        loggedIn: true,
      });
    });

    it("Should open the account modal", () => {
      Menu.menuButton().click();
      Menu.menuModal().should("be.visible");
      Menu.options.account().click();

      // Check if the modal is visible
      Menu.accountModal.container().should("be.visible");
      Menu.accountModal.backdrop().should("be.visible");
    });

    it("Should change user name", () => {
      Menu.accountModal.loggedInView.fullNameInput().should("have.value", "John");
      Menu.accountModal.loggedInView.fullNameInput().clear().type("Max");
      Menu.accountModal.loggedInView.saveInfoBtn().click();

      // Check if the name has changed
      Menu.accountModal.closeBtn().click();
      Menu.menuButton().click();
      Menu.options.account().click();
      Menu.accountModal.loggedInView.fullNameInput().should("have.value", "Max");
    });
    // Can't test change email, password, clear data or delete account because of reauthentication
  });

  describe("Testing Logged Out", () => {
    before(() => {
      navigateToMelofi({
        seedWithUser: false,
        skipOnboarding: true,
        loggedIn: true,
      });
      Menu.menuButton().click();
      Menu.options.account().click();
    });

    it("Should open the account modal and show sign up form", () => {
      Menu.accountModal.loggedOutView.title().should("have.text", "Join Melofi");
      Menu.accountModal.loggedOutView.firstNameInput().should("have.value", "John");
      Menu.accountModal.loggedOutView.emailInput().should("be.visible");
      Menu.accountModal.loggedOutView.passwordInput().should("be.visible");
      Menu.accountModal.loggedOutView.newsletterCheckbox().should("be.visible");
      Menu.accountModal.loggedOutView.continueBtn().should("have.text", "Let's Go!");
      Menu.accountModal.loggedOutView.haveAccountBtn().should("be.visible");
    });

    it("Should show sign in form", () => {
      Menu.accountModal.loggedOutView.haveAccountBtn().click();
      Menu.accountModal.loggedOutView.title().should("have.text", "Welcome Back!");
      Menu.accountModal.loggedOutView.emailInput().should("be.visible");
      Menu.accountModal.loggedOutView.passwordInput().should("be.visible");
      Menu.accountModal.loggedOutView.continueBtn().should("have.text", "Dive In");
      Menu.accountModal.loggedOutView.forgotPasswordBtn().should("be.visible");
      Menu.accountModal.loggedOutView.noAccountBtn().should("be.visible");
    });

    it("Should show forgot password form", () => {
      Menu.accountModal.loggedOutView.forgotPasswordBtn().click();
      Menu.accountModal.loggedOutView.title().should("have.text", "Forgot Your Password?");
      Menu.accountModal.loggedOutView.emailInput().should("be.visible");
      Menu.accountModal.loggedOutView.continueBtn().should("have.text", "Send Reset Link");
      Menu.accountModal.loggedOutView.backBtn().click();
      Menu.accountModal.loggedOutView.title().should("have.text", "Welcome Back!");
    });
  });
});
