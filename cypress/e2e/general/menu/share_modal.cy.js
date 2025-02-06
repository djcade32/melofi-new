import { navigateToMelofi } from "../../../utils/general.ts";
import { Menu } from "../../pages/Menu.page";
import { Toaster } from "../../pages/common/Toaster.page";
import "cypress-real-events/support.js";

describe("Testing Share Modal", () => {
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

  it("Should open the share modal", () => {
    Menu.menuButton().click();
    Menu.menuModal().should("be.visible");
    Menu.options.share().click();

    // Check if the modal is visible
    Menu.shareModal.container().should("be.visible");
    Menu.backdrop().should("be.visible");

    // Check if the modal has the correct content
    Menu.shareModal.title().contains("Good Vibes Are Better Shared");
    Menu.shareModal.subtext().should("be.visible");
    Menu.shareModal.copyLinkBtn().should("be.visible");
  });

  it("Should copy the link to the clipboard", () => {
    Menu.shareModal.copyLinkBtn().realClick();
    Toaster.container().should("be.visible");
    Toaster.message().should("have.text", "Copied to clipboard");
  });

  it("Should close the share modal", () => {
    Menu.shareModal.closeBtn().realClick();
    Menu.shareModal.container().should("not.be.visible");
    Menu.backdrop().should("not.be.visible");
  });
});
