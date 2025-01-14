import { navigateToMelofi } from "../../utils/general.ts";

describe("Testing Now Playing", () => {
  before(() => {
    navigateToMelofi();
  });
  after(() => {
    cy.clearLocalStorage();
  });

  it("Should show the now playing section", () => {
    cy.get("#now-playing").should("be.visible");
  });

  it("Should change current song info", () => {
    let currentSongTitle = "";
    cy.get("#now-playing-song-title")
      .invoke("text")
      .then((songTitle) => {
        currentSongTitle = songTitle;
      });
    cy.get("#music-controls-next").click();
    cy.get("#now-playing-song-title")
      .invoke("text")
      .then((newSongTitle) => {
        expect(newSongTitle).to.not.equal(currentSongTitle);
      });
  });
});
