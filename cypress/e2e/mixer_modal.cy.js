import { navigateToMelofi, pressMixerButton } from "../utils/general";
import "cypress-real-events/support";

describe("Testing Mixer Modal", () => {
  before(() => {
    navigateToMelofi();
  });

  it("should open and close Mixer Modal", () => {
    pressMixerButton();
    cy.get("#mixer-modal").should("be.visible");
    pressMixerButton();
    cy.get("#mixer-modal").should("not.be.visible");
    pressMixerButton();
    cy.get(".modal_modal__title_container__bWI8Q").get("svg").realClick();
    cy.get("#mixer-modal").should("not.be.visible");
  });

  describe("Testing Playlist Section", () => {
    it("Playlist button should highlight when active", () => {
      pressMixerButton();
      cy.get("#playlist-button-Relax").realClick();
      cy.get("#playlist-button-Relax").should(
        "have.css",
        "border-color",
        "rgba(254, 165, 57, 0.88)"
      );
    });

    it("Playlist should change", () => {
      let currentSongTitle = "";
      cy.get("#now-playing")
        .get(".nowPlaying_nowPlaying__song_title__HU3pq")
        .invoke("text")
        .then((songTitle) => {
          currentSongTitle = songTitle;
        });
      cy.get("#playlist-button-Study").realClick();
      cy.get("#now-playing")
        .get(".nowPlaying_nowPlaying__song_title__HU3pq")
        .invoke("text")
        .then((newSongTitle) => {
          expect(newSongTitle).to.not.equal(currentSongTitle);
        });
    });
  });

  describe("Testing Music Source Section", () => {
    it("Should switch to Melofi music source while showing music controls and now playing components ", () => {
      cy.get("#music-source-button-melofi").realClick();
      cy.get("#music-source-button-melofi").should(
        "have.css",
        "background-color",
        "rgba(254, 165, 57, 0.88)"
      );
      cy.get("#music-controls").should("be.visible");
      cy.get("#now-playing").should("be.visible");
    });

    it("Should switch to Spotify music source and music controls and now playing components should not show ", () => {
      cy.get("#music-source-button-spotify").realClick();
      cy.get("#music-source-button-spotify").should(
        "have.css",
        "background-color",
        "rgba(254, 165, 57, 0.88)"
      );
      cy.get("#music-controls").should("not.exist");
      cy.get("#now-playing").should("not.exist");
    });

    it("Should show volume section when Melofi music source is selected", () => {});
    it("Should show Spotify section when Spotify music source is selected", () => {});
  });

  describe("Testing Volume Section", () => {
    it("Should show volume slide and change volume", () => {
      let currentSliderValue = 0;
      let currentVolume = 0;

      //Switch to Melofi source
      cy.get("#music-source-button-melofi").realClick();

      //Get current volume
      cy.get("#mixer-modal-volume-slider")
        .get("input")
        .invoke("attr", "value")
        .then((value) => {
          currentSliderValue = value;
        });
      cy.get("#main-audio").then(($audio) => {
        currentVolume = $audio[0].volume; // Access the volume property of the first audio element
      });

      //Change volume
      cy.get("#mixer-modal-volume-slider")
        .get(".MuiSlider-track") // Replace with your actual selector
        .realClick();

      //Check if volume has changed
      cy.get("#mixer-modal-volume-slider")
        .get("input")
        .invoke("attr", "value")
        .then((value) => {
          expect(value).to.not.equal(currentSliderValue);
        });
      cy.get("#main-audio").then(($audio) => {
        expect($audio[0].volume).to.not.equal(currentVolume);
      });
    });
  });
});
