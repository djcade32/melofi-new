import { Editor, Element as SlateElement, Transforms } from "slate";
import {
  MdCode,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatUnderlined,
  MdLooksOne,
  MdLooksTwo,
} from "@/imports/icons";

export const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

export const TOOLBAR_TOOLTIP_MAPPINGS = {
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  code: "Code",
  "heading-one": "Heading 1",
  "heading-two": "Heading 2",
  "block-quote": "Block quote",
  "numbered-list": "Numbered list",
  "bulleted-list": "Bulleted list",
  left: "Left align",
  center: "Center align",
  right: "Right align",
  justify: "Justify",
};

export const getIcon = (format: string) => {
  switch (format) {
    case "bold":
      return MdFormatBold;
    case "italic":
      return MdFormatItalic;
    case "underline":
      return MdFormatUnderlined;
    case "code":
      return MdCode;
    case "heading-one":
      return MdLooksOne;
    case "heading-two":
      return MdLooksTwo;
    case "block-quote":
      return MdFormatQuote;
    case "numbered-list":
      return MdFormatListNumbered;
    case "bulleted-list":
      return MdFormatListBulleted;
    case "left":
      return MdFormatAlignLeft;
    case "center":
      return MdFormatAlignCenter;
    case "right":
      return MdFormatAlignRight;
    case "justify":
      return MdFormatAlignJustify;
    default:
      return MdFormatBold;
  }
};

export const isBlockActive = (editor: Editor, format: string, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: selection ? Editor.unhangRange(editor, selection) : undefined,
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    })
  );

  return !!match;
};

export const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor) as Record<string, boolean> | null;
  return marks ? marks[format] === true : false;
};

export const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      !!n.type &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isMultipleFontsSelected = (editor: Editor) => {
  const { selection } = editor;
  if (!selection) return false;
  const fontsSelected: string[] = [];

  // Check if multiple fonts are selected
  const [multipleFonts] = Array.from(
    Editor.nodes(editor, {
      at: selection ? Editor.unhangRange(editor, selection) : undefined,
      match: (n) => {
        if (!Editor.isEditor(n) && !SlateElement.isElement(n) && n.text && n.fontFamily) {
          !fontsSelected.includes(n.fontFamily) && fontsSelected.push(n.fontFamily);
        }
        return !!(fontsSelected.length > 1);
      },
    })
  );

  return multipleFonts;
};

export const applyFontFamily = (editor: Editor, fontFamily: string) => {
  Editor.addMark(editor, "fontFamily", fontFamily);
};

export const applyFontSize = (editor: Editor, fontSize: number) => {
  Editor.addMark(editor, "fontSize", fontSize);
};
