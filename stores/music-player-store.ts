import { create } from "zustand";
import { Playlist, Song } from "@/types/interfaces";
import { Study } from "@/data/songs";

enum MusicSource {
  MELOFI = "melofi",
  SPOTIFY = "spotify",
}

export interface MusicPlayerState {
  currentSong: Song;
  currentPlaylist: Playlist;
  musicSource: MusicSource.MELOFI | MusicSource.SPOTIFY;
  isMuted: boolean;
  isPlaying: boolean;
  musicVolume: number;

  setCurrentSong: (newSong: Song) => void;
  setMusicSource: (newSource: MusicSource) => void;
  setCurrentPlaylist: (newPlaylist: Playlist) => void;
  shufflePlaylist: () => void;
  goToNextSong: () => void;
  goToPreviousSong: () => void;
  setIsMuted: (isMuted: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setMusicVolume: (volume: number) => void;
}

const useMusicPlayerStore = create<MusicPlayerState>((set) => ({
  currentPlaylist: Study,
  currentSong: Study.songs[0],
  musicSource: MusicSource.MELOFI,
  isMuted: false,
  isPlaying: false,
  musicVolume: 50,

  setCurrentSong: (newSong: Song) => {
    set({ currentSong: newSong });
  },
  setMusicSource: (newSource: MusicSource) => {
    set({ musicSource: newSource });
  },
  setCurrentPlaylist: (newPlaylist: Playlist) => {
    set({ currentPlaylist: newPlaylist });
  },
  shufflePlaylist: () => {
    set((state) => {
      const shuffledPlaylist = state.currentPlaylist.songs
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      return {
        currentPlaylist: { ...state.currentPlaylist, songs: shuffledPlaylist },
        currentSong: shuffledPlaylist[0],
      };
    });
  },
  goToNextSong: () => {
    set((state) => {
      const currentIndex = state.currentPlaylist.songs.findIndex(
        (song) => song === state.currentSong
      );
      const nextIndex = currentIndex + 1;
      const nextSong = state.currentPlaylist.songs[nextIndex % state.currentPlaylist.songs.length];
      return { currentSong: nextSong };
    });
  },
  goToPreviousSong: () => {
    set((state) => {
      const currentIndex = state.currentPlaylist.songs.findIndex(
        (song) => song === state.currentSong
      );
      const previousIndex = currentIndex - 1;
      const previousSong =
        state.currentPlaylist.songs[
          (previousIndex + state.currentPlaylist.songs.length) % state.currentPlaylist.songs.length
        ];
      return { currentSong: previousSong };
    });
  },
  setIsMuted: (isMuted: boolean) => {
    set({ isMuted });
  },
  setIsPlaying: (isPlaying: boolean) => {
    set({ isPlaying });
  },
  setMusicVolume: (volume: number) => {
    set({ musicVolume: volume });
  },
}));

export default useMusicPlayerStore;
