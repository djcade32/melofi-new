import { navigateToMelofi, pressMixerButton } from "../utils/general";
import "cypress-real-events/support";

describe("Testing Mixer Modal", () => {
  before(() => {
    navigateToMelofi();
  });

  describe("Testing Playlist Section", () => {
    it("Playlist button should highlight when active", () => {
      pressMixerButton();
      cy.get("#playlist-button-Relax").realClick();
      cy.get("#playlist-button-Relax").should(
        "have.css",
        "background-color",
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
});
