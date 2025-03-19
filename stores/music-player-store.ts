import { create } from "zustand";
import { Song } from "@/types/general";
import { Study } from "@/data/songs";
import useTemplatesStore from "./widgets/templates-store";
import { Playlist } from "@/types/interfaces/mixer";

export interface MusicPlayerState {
  currentSong: Song;
  currentPlaylist: Playlist;
  isMuted: boolean;
  isPlaying: boolean;
  musicVolume: number;

  setCurrentSong: (newSong: Song) => void;
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
  isMuted: false,
  isPlaying: false,
  musicVolume: 50,

  setCurrentSong: (newSong: Song) => {
    set({ currentSong: newSong });
  },

  setCurrentPlaylist: (newPlaylist: Playlist) => {
    const { settingsChanged, selectedTemplate } = useTemplatesStore.getState();
    set({ currentPlaylist: newPlaylist });
    selectedTemplate && settingsChanged();
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
