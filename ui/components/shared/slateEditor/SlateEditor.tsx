import React, { useCallback, useEffect, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate, RenderElementProps, RenderLeafProps } from "slate-react";
import { createEditor, Descendant, Transforms } from "slate";

import { withHistory } from "slate-history";

import EditorToolbar from "@/ui/components/shared/slateEditor/components/EditorToolbar";
import {
  MdCode,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatUnderlined,
  MdLooksOne,
  MdLooksTwo,
} from "@/imports/icons";
import { toggleMark } from "./helpers";
import MarkButton from "./components/MarkButton";
import BlockButton from "./components/BlockButton";
import styles from "./slateEditor.module.css";
import { Note } from "@/types/general";
import useNotesStore from "@/stores/widgets/notes-store";
import EditorTimeDisplay from "./components/EditorTimeDisplay";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+": "code",
};

const initialValue: Descendant[] = [
  {
    type: "numbered-list",
    children: [
      {
        type: "list-item",
        align: "left",
        children: [
          {
            text: "This is a test",
          },
        ],
      },
    ],
  },
];

interface SlateEditorProps {
  note: Note;
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
  // Define alignment styles
  const style: React.CSSProperties = {
    fontFamily: "Poppins",
    // textAlign: element.align as React.CSSProperties["textAlign"],
    // fontSize: 16,
  };

  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={{ ...style, paddingLeft: 25 }} {...attributes}>
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol style={{ ...style, paddingLeft: 25 }} {...attributes}>
          {children}
        </ol>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const style: React.CSSProperties = {
    // fontFamily: leaf.fontFamily, // Apply font family
    // fontSize: leaf.fontSize, // Apply font size
  };

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

const SlateEditor = ({ note }: SlateEditorProps) => {
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const { updateNote } = useNotesStore();

  // Needed to force re-render when the note changes
  const [noteId, setNoteId] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!note) return;
    setNoteId(note.id);
  }, [note.id]);

  // Reset selection when the note changes
  useEffect(() => {
    Transforms.deselect(editor); // Clear selection
  }, [note.id, editor]);

  const handleOnChange = (newValue: Descendant[]) => {
    if (newValue === note.text || noteId !== note.id) return;
    clearTimeout(debounceTimeout as NodeJS.Timeout);
    setDebounceTimeout(
      setTimeout(() => {
        updateNote({
          ...note,
          text: newValue,
        });
      }, 1000)
    );
  };

  return (
    <Slate
      key={noteId} // Force re-render when the note changes
      editor={editor}
      initialValue={note.text}
      onChange={handleOnChange}
    >
      <EditorToolbar>
        <MarkButton format="bold" icon={MdFormatBold} />
        <MarkButton format="italic" icon={MdFormatItalic} />
        <MarkButton format="underline" icon={MdFormatUnderlined} />
        <MarkButton format="code" icon={MdCode} />
        <div
          style={{
            width: 1,
            height: 25,
            backgroundColor: "var(--color-secondary)",
            margin: "0 2px",
          }}
        />
        <BlockButton format="heading-one" icon={MdLooksOne} />
        <BlockButton format="heading-two" icon={MdLooksTwo} />
        <BlockButton format="block-quote" icon={MdFormatQuote} />
        <BlockButton format="numbered-list" icon={MdFormatListNumbered} />
        <BlockButton format="bulleted-list" icon={MdFormatListBulleted} />
      </EditorToolbar>
      <div
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "var(--color-secondary)",
        }}
      />
      <EditorTimeDisplay note={note} />
      <Editable
        id="slate-editor"
        className={styles.slateEditor__editable}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Click here to start typing..."
        spellCheck
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

export default SlateEditor;
