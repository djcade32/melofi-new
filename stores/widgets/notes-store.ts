import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Note } from "@/types/general";
import { Descendant } from "slate";
import { updateNotes } from "@/lib/firebase/actions/notes-actions";
import useUserStore from "../user-store";
import { getNotesFromDB } from "@/lib/firebase/getters/notes-getters";
import useIndexedDBStore from "../indexedDB-store";
import useAppStore from "../app-store";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("Notes Store");

export interface NotesState {
  isNotesOpen: boolean;
  notes: Note[];
  selectedNote: Note | null;

  setIsNotesOpen: (isOpen: boolean) => void;
  updateNote: (note: Note) => Promise<void>;
  createNewNote: () => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  setNotes: (notes: Note[]) => Promise<void>;
  setSelectedNote: (note: Note | null) => Promise<void>;
  resetNotesData: (uid: string, resetDb?: boolean) => Promise<void>;
  fetchNotes: () => Promise<void>;
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    align: "left",
    children: [{ text: "" }],
  },
];

const useNotesStore = create<NotesState>((set, get) => ({
  isNotesOpen: false,
  notes: [],
  selectedNote: null,

  setIsNotesOpen: (isOpen) => set({ isNotesOpen: isOpen }),

  updateNote: async (note) => {
    const { currentUser } = useUserStore.getState();
    const { isOnline } = useAppStore.getState();

    const notes = get().notes;
    const noteIndex = notes.findIndex((n) => n.id === note.id);
    // If note is not found, throw an error
    if (noteIndex === -1) {
      throw new Error("Error: Cannot update because note not found");
    }

    note.updatedAt = new Date().toISOString();
    const newNotesList = notes.filter((n) => n.id !== note.id);
    newNotesList.unshift(note);

    await get().setNotes(newNotesList);
    await get().setSelectedNote(note);
    currentUser?.authUser?.uid && isOnline && updateNotes(currentUser.authUser.uid, newNotesList);
  },

  createNewNote: async () => {
    Logger.debug.info("Creating new note...");
    // const { currentUser } = useUserStore.getState();
    const newNote: Note = {
      id: uuidv4(),
      title: "Untitled Note",
      text: initialValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const notes = get().notes;
    // Add new note to the beginning of the notes array
    notes.unshift(newNote);

    await get().setNotes(notes);
    await get().setSelectedNote(newNote);
  },

  deleteNote: async (noteId) => {
    Logger.debug.info("Deleting note...");
    const { currentUser } = useUserStore.getState();
    const { isOnline } = useAppStore.getState();

    const notes = get().notes;
    const noteIndex = notes.findIndex((n) => n.id === noteId);
    // If note is not found, throw an error
    if (noteIndex === -1) {
      throw new Error("Error: Cannot delete because note not found");
    }
    notes.splice(noteIndex, 1);

    await get().setNotes(notes);
    await get().setSelectedNote(notes[0] || null);
    currentUser?.authUser?.uid && isOnline && updateNotes(currentUser.authUser.uid, notes);
  },

  setNotes: async (notes) => {
    Logger.debug.info("Setting notes...");
    const { updateWidgetData } = useIndexedDBStore.getState();
    const { currentUser } = useUserStore.getState();
    set({ notes });
    localStorage.setItem("notes", JSON.stringify(notes));
    currentUser?.authUser?.uid &&
      (await updateWidgetData(currentUser.authUser.uid, (settings) => {
        settings.notesList.notesList = JSON.stringify(notes);
        return settings;
      }));
  },

  setSelectedNote: async (note) => {
    Logger.debug.info("Setting selected note...");
    const { updateWidgetData } = useIndexedDBStore.getState();
    const { currentUser } = useUserStore.getState();
    set({ selectedNote: note });
    localStorage.setItem("selected_note", JSON.stringify(note));
    currentUser?.authUser?.uid &&
      (await updateWidgetData(currentUser.authUser.uid, (settings) => {
        settings.selectedNote.selectedNote = JSON.stringify(note);
        return settings;
      }));
  },

  resetNotesData: async (uid: string, resetDb: boolean = true) => {
    const { setNotes, setSelectedNote } = get();

    await setNotes([]);
    await setSelectedNote(null);
    localStorage.removeItem("notes");
    localStorage.removeItem("selected_note");
    resetDb && updateNotes(uid, []);
  },

  fetchNotes: async () => {
    Logger.debug.info("Fetching notes...");
    const { currentUser } = useUserStore.getState();
    const { isOnline } = useAppStore.getState();
    const { indexedDB } = useIndexedDBStore.getState();

    // If not online grab notes from indexedDB
    if (!isOnline && indexedDB && currentUser?.authUser?.uid) {
      Logger.debug.info("Fetching notes from IndexedDB...");
      const data = await indexedDB?.get("widgetData", currentUser.authUser.uid);
      if (data) {
        await get().setNotes(JSON.parse(data.notesList.notesList));
        await get().setSelectedNote(JSON.parse(data.selectedNote.selectedNote));
        Logger.debug.info("Notes fetched from IndexedDB");
      } else {
        Logger.debug.info("No notes found in IndexedDB");
      }
      return;
    }
    let notesList = localStorage.getItem("notes") || "[]";
    let selectedNote = localStorage.getItem("selected_note") || null;
    const notesObj = currentUser?.authUser?.uid
      ? await getNotesFromDB(currentUser.authUser.uid)
      : {
          notesList: JSON.parse(notesList),
          selectedNote: selectedNote ? JSON.parse(selectedNote) : null,
        };
    get().setNotes(notesObj.notesList);
    get().setSelectedNote(notesObj.selectedNote);
  },
}));

export default useNotesStore;
