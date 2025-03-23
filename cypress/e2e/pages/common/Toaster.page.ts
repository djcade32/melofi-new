/// <reference types="cypress" />

import { getElementWithClassName } from "../../../utils/general";

export class Toaster {
  static container = () => cy.get("#melofi-toaster");
  static message = () => getElementWithClassName("toaster__message_content").find("p");
  static closeBtn = () => getElementWithClassName("toaster__close_button");
}
