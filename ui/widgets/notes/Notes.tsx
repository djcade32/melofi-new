import React, { useEffect, useRef, useState } from "react";
import styles from "./notes.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import "react-quill/dist/quill.snow.css";
import useNotesStore from "@/stores/widgets/notes-store";
import SlateEditor from "@/ui/components/shared/slateEditor/SlateEditor";
import NoteCard from "./components/noteCard/NoteCard";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import { IoCreate, HiTrash } from "@/imports/icons";
import { Note } from "@/types/general";
import useUserStatsStore from "@/stores/user-stats-store";
import useUserStore from "@/stores/user-store";

const Notes = () => {
  const {
    isNotesOpen,
    setIsNotesOpen,
    notes,
    updateNote,
    selectedNote,
    createNewNote,
    deleteNote,
    fetchNotes,
  } = useNotesStore();
  const { incrementTotalNotesCreated } = useUserStatsStore();
  const { currentUser } = useUserStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedNoteTitle, setSelectedNoteTitle] = useState(selectedNote?.title || "");

  useEffect(() => {
    const fetchNotesData = async () => await fetchNotes();
    fetchNotesData();
  }, [currentUser]);

  useEffect(() => {
    const note = JSON.parse(localStorage.getItem("selected_note") as string) as Note;
    if (note) {
      setSelectedNoteTitle(note.title);
    } else {
      setSelectedNoteTitle("");
    }
  }, [selectedNote]);

  const handleSaveNoteTitle = () => {
    if (!selectedNote) return;

    selectedNoteTitle.trim() === ""
      ? setSelectedNoteTitle(selectedNote.title)
      : updateNote({
          ...selectedNote,
          title: selectedNoteTitle.trim(),
        } as Note);
  };

  const handleCreateNewNote = async () => {
    await createNewNote();
    currentUser?.authUser?.email && incrementTotalNotesCreated();
    //Give time for note to render and then Focus on the title input of the new note
    setTimeout(() => {
      inputRef.current?.focus();
    }, 250);
  };

  const handleDeleteNote = () => {
    if (!selectedNote) return;
    deleteNote(selectedNote.id);
  };

  return (
    <Modal
      id={`notes-widget`}
      isOpen={isNotesOpen}
      className={styles.notes__modal_container}
      draggable
      close={() => setIsNotesOpen(false)}
      isWidget
      name="notes"
    >
      <div className={styles.notes__content_container}>
        <div className={styles.notes__sidebar_container}>
          <div className={styles.notes__sidebar_action_buttons_container}>
            <HoverIcon
              id="create-note-button"
              icon={IoCreate}
              size={20}
              color="var(--color-secondary-white)"
              inverted
              containerClassName={styles.notes__sidebar_action_button}
              onClick={handleCreateNewNote}
            />
            <HoverIcon
              id="delete-note-button"
              icon={HiTrash}
              size={20}
              color="var(--color-secondary-white)"
              inverted
              containerClassName={styles.notes__sidebar_action_button}
              onClick={handleDeleteNote}
              disabled={!selectedNote}
            />
            {notes?.length > 0 && (
              <p
                style={{
                  color: "var(--color-secondary)",
                  marginLeft: "auto",
                }}
              >
                {notes.length === 1 ? "1 Note" : `${notes.length} Notes`}
              </p>
            )}
          </div>
          <div className={styles.notes__notesCard_container}>
            {notes?.map((note) => (
              <NoteCard key={note.id} note={note} selected={selectedNote?.id === note.id} />
            ))}
          </div>
        </div>
        <div className={styles.notes__content_section_divider} />
        <div style={{ width: "100%" }}>
          {selectedNote ? (
            <>
              <div className={styles.notes__current_note_title_container}>
                <input
                  id="notes-title-input"
                  ref={inputRef}
                  type="text"
                  value={selectedNoteTitle}
                  onChange={(e) => setSelectedNoteTitle(e.target.value)}
                  onBlur={handleSaveNoteTitle}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                />
              </div>
              <SlateEditor note={selectedNote} />
            </>
          ) : (
            <div className={styles.notes__no_note_selected_container}>
              <p>No notes created</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default Notes;
