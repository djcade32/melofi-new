import { navigateToMelofi } from "../../utils/general.ts";
import "cypress-real-events/support.js";

describe("Testing Music Controls", () => {
  before(() => {
    navigateToMelofi();
  });

  after(() => {
    cy.clearLocalStorage();
  });
  // Preserve cookies and local/session storage across tests

  it("Should play and pause music", () => {
    cy.get("#music-controls-play").realClick();
    cy.get("#music-controls-pause").should("be.visible");
    cy.wait(2000);
    cy.get("#music-controls-pause").realClick();
    cy.get("#music-controls-play").should("be.visible");
  });

  it("Should play next song", () => {
    let songSrc = "";
    cy.get("#main-audio") // Replace with your actual selector
      .invoke("attr", "src") // Get the 'src' attribute
      .then((src) => {
        songSrc = src;
      });
    cy.get("#music-controls-next").realClick();
    cy.get("#main-audio")
      .invoke("attr", "src")
      .then((newSrc) => {
        expect(newSrc).to.not.equal(songSrc);
      });
  });

  it("Should play previous song", () => {
    let songSrc = "";
    cy.get("#main-audio") // Replace with your actual selector
      .invoke("attr", "src") // Get the 'src' attribute
      .then((src) => {
        songSrc = src;
      });
    cy.get("#music-controls-previous").realClick();
    cy.get("#main-audio")
      .invoke("attr", "src")
      .then((newSrc) => {
        expect(newSrc).to.not.equal(songSrc);
      });
  });

  it("Should show volume slide and change volume", () => {
    let currentSliderValue = 0;
    let currentVolume = 0;
    //Open volume slider
    cy.get("#music-controls-volume").realClick();
    cy.get("#music-controls-volume-slider-container").should("be.visible");

    //Get current volume
    cy.get("#music-controls-volume-slider")
      .get("input")
      .invoke("attr", "value")
      .then((value) => {
        currentSliderValue = value;
      });
    cy.get("#main-audio").then(($audio) => {
      currentVolume = $audio[0].volume; // Access the volume property of the first audio element
    });

    //Get rid of volume tooltip
    cy.get("#melofi-app").realClick();

    //Change volume
    cy.get("#music-controls-volume-slider")
      .get(".MuiSlider-track") // Replace with your actual selector
      .realClick();

    //Check if volume has changed
    cy.get("#music-controls-volume-slider")
      .get("input")
      .invoke("attr", "value")
      .then((value) => {
        expect(value).to.not.equal(currentSliderValue);
      });
    cy.get("#main-audio").then(($audio) => {
      expect($audio[0].volume).to.not.equal(currentVolume);
    });
  });

  it("Should mute and unmute music", () => {
    cy.get("#music-controls-mute-all").realClick();
    cy.get("#main-audio").then(($audio) => {
      expect($audio[0].muted).to.equal(true);
    });
    cy.get("#music-controls-mute-all").realClick();
    cy.get("#main-audio").then(($audio) => {
      expect($audio[0].muted).to.equal(false);
    });
  });
});
