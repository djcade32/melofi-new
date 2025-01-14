import { navigateToMelofi, pressMixerButton } from "../utils/general.ts";
import "cypress-real-events/support.js";

describe("Testing Mixer Modal", () => {
  before(() => {
    navigateToMelofi();
  });

  after(() => {
    cy.clearLocalStorage();
  });

  it("should open and close Mixer Modal", () => {
    pressMixerButton();
    cy.get("#mixer-modal").should("be.visible");
    pressMixerButton();
    cy.get("#mixer-modal").should("not.be.visible");
    pressMixerButton();
    cy.get("#mixer-modal-close-icon").realClick();
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
      cy.get("#now-playing-song-title")
        .invoke("text")
        .then((songTitle) => {
          currentSongTitle = songTitle;
        });
      cy.get("#playlist-button-Study").realClick();
      cy.get("#now-playing-song-title")
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

    it("Should show volume section when Melofi music source is selected", () => {
      cy.get("#music-source-button-melofi").realClick();
      cy.get("#mixer-modal-volume-slider").should("be.visible");
    });

    it("Should show Spotify section when Spotify music source is selected", () => {
      cy.get("#music-source-button-spotify").realClick();
      cy.get("#mixer-modal-spotify-widget").should("be.visible");
    });

    it("Should change Spotify playlist", () => {
      const playlistInput =
        "https://open.spotify.com/playlist/0WcchMXMGm91OoxZFN93gv?si=eafeddcf22dc45fa";

      cy.get("#mixer-modal-spotify-widget").then(($iframe) => {
        const src = $iframe.attr("src");
      });
      cy.get("#spotify-widget-input").type(playlistInput);
      cy.get("#spotify-widget-input-go").realClick();
      cy.get("#mixer-modal-spotify-widget").then(($iframe) => {
        expect($iframe.attr("src")).to.include("0WcchMXMGm91OoxZFN93gv");
      });
    });

    it("Should show error message when invalid Spotify playlist is entered", () => {
      const playlistInput = "this is an invalid playlist";

      cy.get("#spotify-widget-input").type(playlistInput);
      cy.get("#spotify-widget-input-go").realClick();
      cy.get("#melofi-toaster").should("be.visible");
      cy.get("#melofi-toaster").should("have.text", "Invalid Spotify Playlist Link");
    });
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
      cy.get("#mixer-modal-volume-slider").get(".MuiSlider-track").realClick();

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

  describe("Testing Scene Sounds Section", () => {
    it("Should show the correct scene sounds", () => {
      cy.get("#Rain-mixer-slider").should("be.visible");
      cy.get("#Chatter-mixer-slider").should("be.visible");
      cy.get("#Nature-mixer-slider").should("be.visible");
    });

    it("Each mixer slider should change the volume of the corresponding sound", () => {
      let currentRainVolume = 0;
      let currentChatterVolume = 0;
      let currentNatureVolume = 0;

      //Get current volume
      cy.get("#Rain-mixer-slider")
        .find("input")
        .invoke("attr", "value")
        .then((value) => {
          currentRainVolume = value;
        });

      cy.get("#Chatter-mixer-slider")
        .find("input")
        .invoke("attr", "value")
        .then((value) => {
          currentChatterVolume = value;
        });

      cy.get("#Nature-mixer-slider")
        .find("input")
        .invoke("attr", "value")
        .then((value) => {
          currentNatureVolume = value;
        });

      //Change volume
      cy.get("#Rain-mixer-slider").find(".MuiSlider-rail").realClick();

      cy.get("#Chatter-mixer-slider").find(".MuiSlider-rail").realClick();

      cy.get("#Nature-mixer-slider").find(".MuiSlider-rail").realClick();

      //Check if volume has changed
      cy.get("#Rain-mixer-slider")
        .find("input")
        .invoke("attr", "value")
        .then((value) => {
          expect(value).to.not.equal(currentRainVolume);
        });

      cy.get("#Chatter-mixer-slider")
        .find("input")
        .invoke("attr", "value")
        .then((value) => {
          expect(value).to.not.equal(currentChatterVolume);
        });

      cy.get("#Nature-mixer-slider")
        .find("input")
        .invoke("attr", "value")
        .then((value) => {
          expect(value).to.not.equal(currentNatureVolume);
        });
    });

    it("Should reset all sounds", () => {
      cy.get("#mixer-reset-button").realClick();
      cy.get("#Rain-mixer-slider")
        .find("input")
        .invoke("attr", "value")
        .then((value) => {
          expect(value).to.equal("0");
        });

      cy.get("#Chatter-mixer-slider")
        .find("input")
        .invoke("attr", "value")
        .then((value) => {
          expect(value).to.equal("0");
        });

      cy.get("#Nature-mixer-slider")
        .find("input")
        .invoke("attr", "value")
        .then((value) => {
          expect(value).to.equal("0");
        });
    });
  });
});
