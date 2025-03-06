import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Note } from "@/types/general";
import { Descendant } from "slate";
import { updateNotes } from "@/lib/firebase/actions/notes-actions";
import useUserStore from "../user-store";
import { getNotesFromDB } from "@/lib/firebase/getters/notes-getters";

export interface NotesState {
  isNotesOpen: boolean;
  notes: Note[];
  selectedNote: Note | null;

  setIsNotesOpen: (isOpen: boolean) => void;
  updateNote: (note: Note) => void;
  createNewNote: () => Promise<void>;
  deleteNote: (noteId: string) => void;
  setNotes: (notes: Note[]) => void;
  setSelectedNote: (note: Note | null) => void;
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

  updateNote: (note) => {
    console.log("Updating note: ");
    const { currentUser } = useUserStore.getState();

    const notes = get().notes;
    const noteIndex = notes.findIndex((n) => n.id === note.id);
    // If note is not found, throw an error
    if (noteIndex === -1) {
      throw new Error("Error: Cannot update because note not found");
    }

    note.updatedAt = new Date().toISOString();
    const newNotesList = notes.filter((n) => n.id !== note.id);
    newNotesList.unshift(note);

    get().setNotes(newNotesList);
    get().setSelectedNote(note);
    currentUser?.authUser?.uid && updateNotes(currentUser.authUser.uid, newNotesList);
  },

  createNewNote: async () => {
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

    get().setNotes(notes);
    get().setSelectedNote(newNote);
    // currentUser?.authUser?.uid && updateNotes(currentUser.authUser.uid, notes);
  },

  deleteNote: (noteId) => {
    const { currentUser } = useUserStore.getState();

    const notes = get().notes;
    const noteIndex = notes.findIndex((n) => n.id === noteId);
    // If note is not found, throw an error
    if (noteIndex === -1) {
      throw new Error("Error: Cannot delete because note not found");
    }
    notes.splice(noteIndex, 1);

    get().setNotes(notes);
    get().setSelectedNote(notes[0] || null);
    currentUser?.authUser?.uid && updateNotes(currentUser.authUser.uid, notes);
  },

  setNotes: (notes) => {
    set({ notes });
    localStorage.setItem("notes", JSON.stringify(notes));
  },

  setSelectedNote: (note) => {
    set({ selectedNote: note });
    localStorage.setItem("selected_note", JSON.stringify(note));
  },

  resetNotesData: async (uid: string, resetDb: boolean = true) => {
    set({ notes: [], selectedNote: null });
    localStorage.removeItem("notes");
    localStorage.removeItem("selected_note");
  },

  fetchNotes: async () => {
    const { currentUser } = useUserStore.getState();

    const notesObj = currentUser?.authUser?.uid
      ? await getNotesFromDB(currentUser.authUser.uid)
      : { notesList: [], selectedNote: null };
    const { notesList, selectedNote } = notesObj;
    get().setNotes(notesList);
    get().setSelectedNote(selectedNote);
  },
}));

export default useNotesStore;
