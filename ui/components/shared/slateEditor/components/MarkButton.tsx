import { ToolbarButtonProps } from "@/types/interfaces/slate_editor";
import { useSlate } from "slate-react";
import { isMarkActive, toggleMark } from "../helpers";
import EditorButton from "./EditorButton";
import React from "react";

const MarkButton = ({ format, icon }: ToolbarButtonProps) => {
  const editor = useSlate();
  const active = isMarkActive(editor, format);

  return (
    <EditorButton
      format={format}
      active={active}
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {React.createElement(icon, {
        color: active ? "var(--color-primary)" : "var(--color-secondary-white)",
        size: 25,
      })}
    </EditorButton>
  );
};

export default MarkButton;
