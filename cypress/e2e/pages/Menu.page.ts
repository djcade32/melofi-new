/// <reference types="cypress" />

import { getElementWithClassName } from "../../utils/general";

const menuModalSelector = "#menu-modal";

export class Menu {
  static menuButton = () => cy.get("#menu-button");
  static menuModal = () => cy.get(menuModalSelector);
  static backdrop = () => cy.get("#menu-modal-backdrop");

  static options = {
    account: () => cy.get(menuModalSelector).contains("Account"),
    insights: () => cy.get(menuModalSelector).contains("Insights"),
    generalSettings: () => cy.get(menuModalSelector).contains("General Settings"),
    leaveFeedback: () => cy.get(menuModalSelector).contains("Leave Feedback"),
    support: () => cy.get(menuModalSelector).contains("Support"),
    about: () => cy.get(menuModalSelector).contains("About Melofi"),
    share: () => cy.get(menuModalSelector).contains("Share With Friends"),
    logout: () => cy.get(menuModalSelector).contains("Logout"),
  };

  static accountModal = {
    container: () => cy.get("#account-modal"),
    closeBtn: () => cy.get("#account-modal-close-button"),
    loggedInView: {
      fullNameInput: () => cy.get("[name=fullname-input]"),
      emailInput: () => cy.get("[name=email-input]"),
      saveInfoBtn: () => cy.get("#account-modal-save-button"),
      reauthenticateModal: {
        container: () => cy.get("#reauthenticate-modal"),
        text: () => cy.get(".reauthenticateModal__text"),
        input: () => cy.get("#reauthenticate-modal [name=password-input]"),
        cancelButn: () => cy.get("#reauthenticate-modal-cancel"),
        submitButn: () => cy.get("#reauthenticate-modal-confirm"),
      },
    },
    loggedOutView: {
      title: () => getElementWithClassName("accountModalSkippedUser__title"),
      emailInput: () => cy.get("[name=email-input]"),
      firstNameInput: () => cy.get("[name=firstName-input]"),
      passwordInput: () => cy.get("[name=password-input]"),
      newsletterCheckbox: () => cy.get("#credentials-newsletter-checkbox"),
      continueBtn: () => getElementWithClassName("accountModalSkippedUser__continue_button"),
      haveAccountBtn: () => getElementWithClassName("accountModalSkippedUser__have_account_text"),
      noAccountBtn: () =>
        getElementWithClassName("accountModalSkippedUser__have_account_text").contains(
          "Don't have an Account? Sign up for Free!"
        ),
      forgotPasswordBtn: () =>
        getElementWithClassName("accountModalSkippedUser__have_account_text").contains(
          "Forgot your password?"
        ),
      backBtn: () => getElementWithClassName("accountModalSkippedUser__back_button"),
    },
  };

  static generalSettingsModal = {
    container: () => cy.get("#general-settings-modal"),
    closeBtn: () => cy.get("#general-settings-modal-close-icon"),
    title: () => getElementWithClassName("generalSettingsModal__title"),
    settings: (setting: string) => {
      return {
        toggle: () =>
          getElementWithClassName("generalSettingsModal__setting_container")
            .contains(setting)
            .parent()
            .scrollIntoView()
            .find("input")
            .click({ force: true }),
      };
    },
    // cy.contains(`[class*="generalSettingsModal__setting_container"]`, setting),
    delayOptions: {
      container: () => cy.get("#general-settings-delay-selector"),
      option: (id: number) => cy.get(`#delay-option-${id}`),
    },
  };

  static aboutMelofiModal = {
    container: () => cy.get("#about-melofi-modal"),
    emailContact: () =>
      getElementWithClassName("aboutMelofiModal__contact").contains("welcome@melofi.app"),
    closeBtn: () => cy.get("#about-melofi-modal-close-icon"),
    title: () => getElementWithClassName("aboutMelofiModal__title"),
    privacyPolicyLink: () =>
      getElementWithClassName("aboutMelofiModal__legal_link").contains("Privacy Policy"),
    termsAndConditionsLink: () =>
      getElementWithClassName("aboutMelofiModal__legal_link").contains("Terms & Conditions"),
    instagramLink: () => getElementWithClassName("aboutMelofiModal__contact").contains("Instagram"),
    version: () => getElementWithClassName("aboutMelofiModal__version"),
  };

  static shareModal = {
    container: () => cy.get("#share-modal"),
    title: () => getElementWithClassName("shareModal__title"),
    subtext: () => getElementWithClassName("shareModal__subtext"),
    copyLinkBtn: () => getElementWithClassName("shareModal__button"),
    closeBtn: () => cy.get("#share-modal-close-icon"),
  };
}
