/// <reference types="cypress" />

import { getElementWithClassName } from "../../utils/general";

export class Menu {
  static menuButton = () => cy.get("#menu-button");
  static menuModal = () => cy.get("#menu-modal");

  static options = {
    account: () => cy.get("#menu-option-1"),
    insights: () => cy.get("#menu-option-2"),
    generalSettings: () => cy.get("#menu-option-3"),
    leaveFeedback: () => cy.get("#menu-option-4"),
    support: () => cy.get("#menu-option-5"),
    about: () => cy.get("#menu-option-6"),
    shareWithFriends: () => cy.get("#menu-option-7"),
    logout: () => cy.get("#menu-option-8"),
  };

  static accountModal = {
    backdrop: () => cy.get("#account-modal-backdrop"),
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
}
