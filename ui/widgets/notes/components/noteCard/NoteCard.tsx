import React from "react";
import styles from "./noteCard.module.css";
import { IoClose } from "@/imports/icons";
import { Note } from "@/types/general";
import useNotesStore from "@/stores/widgets/notes-store";
import { serializeToPlainText } from "@/utils/strings";
import { format } from "date-fns";
import { updateSelectedNote } from "@/lib/firebase/actions/notes-actions";
import useUserStore from "@/stores/user-store";

interface NoteCardProps {
  selected: boolean;
  note: Note;
}

const NoteCard = ({ selected, note }: NoteCardProps) => {
  const { setSelectedNote, deleteNote } = useNotesStore();
  const { currentUser } = useUserStore();

  const getNoteDate = (date: string) => {
    // If date is today, return time
    if (new Date(date).toDateString() === new Date().toDateString()) {
      return format(new Date(date), "h:mm a");
    }
    return format(new Date(date), "MMM dd, yyyy");
  };

  const handleNoteSelection = () => {
    setSelectedNote(note);
    currentUser?.authUser?.uid && updateSelectedNote(currentUser.authUser.uid, note);
  };

  return (
    <div
      id={note.id}
      className={styles.noteCard__container}
      style={{
        backgroundColor: selected ? "var(--color-secondary-opacity)" : "transparent",
      }}
      onClick={handleNoteSelection}
    >
      <div className={styles.noteCard__title_container}>
        <h3>{note.title} </h3>
        <div
          className={styles.noteCard__delete_button}
          onClick={(e) => {
            e.stopPropagation();
            deleteNote(note.id);
          }}
        >
          <IoClose size={12} color="var(--color-primary-opacity)" />
        </div>
      </div>
      <div className={styles.noteCard__footer}>
        <p className={styles.noteCard__date}>{getNoteDate(note.updatedAt)}</p>
        <p className={styles.noteCard__content}>{serializeToPlainText(note.text)}</p>
      </div>
    </div>
  );
};

export default NoteCard;
