import { navigateToMelofi } from "../utils/general";

describe("Testing Now Playing", () => {
  beforeEach(() => {
    navigateToMelofi();
  });

  it("Should show the now playing section", () => {
    cy.get("#now-playing").should("be.visible");
  });

  it("Should change current song info", () => {
    let currentSongTitle = "";
    cy.get("#now-playing")
      .get(".nowPlaying_nowPlaying__song_title__HU3pq")
      .invoke("text")
      .then((songTitle) => {
        currentSongTitle = songTitle;
      });
    cy.get("#music-controls-next").click();
    cy.get("#now-playing")
      .get(".nowPlaying_nowPlaying__song_title__HU3pq")
      .invoke("text")
      .then((newSongTitle) => {
        expect(newSongTitle).to.not.equal(currentSongTitle);
      });
  });
});
