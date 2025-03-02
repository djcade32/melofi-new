import { navigateToMelofi } from "../../../utils/general.ts";
import { Toaster } from "../../pages/common/Toaster.page.ts";
import { Menu } from "../../pages/Menu.page";
import "cypress-real-events/support.js";

describe("Testing About Melofi Modal", () => {
  before(() => {
    navigateToMelofi({
      seedWithUser: true,
      skipOnboarding: false,
      loggedIn: true,
    });
  });
  after(() => {
    cy.clearLocalStorage();
  });

  it("Should open the about melofi modal", () => {
    Menu.menuButton().click();
    Menu.menuModal().should("be.visible");
    Menu.options.about().click();

    // Check if the modal is visible
    Menu.aboutMelofiModal.container().should("be.visible");
    Menu.backdrop().should("be.visible");

    // Check if the modal has the correct content
    Menu.aboutMelofiModal.title().should("have.text", "About Melofi");
    Menu.aboutMelofiModal.privacyPolicyLink().should("have.text", "Privacy Policy");
    Menu.aboutMelofiModal.termsAndConditionsLink().should("have.text", "Terms & Conditions");
    Menu.aboutMelofiModal.emailContact().should("have.text", "welcome@melofi.app");
    Menu.aboutMelofiModal.instagramLink().should("have.text", "Instagram");
    Menu.aboutMelofiModal.version().should("be.visible");
  });

  it("Should copy the email address to the clipboard", () => {
    Menu.aboutMelofiModal.emailContact().realClick();

    Toaster.container().should("be.visible");
    Toaster.message().should("have.text", "Copied to clipboard");
  });

  it("Should close the about melofi modal", () => {
    Menu.aboutMelofiModal.closeBtn().click();

    // Check if the modal is not visible
    Menu.aboutMelofiModal.container().should("not.be.visible");
    Menu.backdrop().should("not.be.visible");
  });
});
