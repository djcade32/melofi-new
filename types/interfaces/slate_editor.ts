import { TOOLBAR_TOOLTIP_MAPPINGS } from "@/ui/components/shared/slateEditor/helpers";
import { ReactNode } from "react";
import { IconType } from "react-icons";
import { BaseElement, BaseText } from "slate";

export interface CustomElement extends BaseElement {
  align?: string;
  type?: string;
  [key: string]: any;
}

export interface CustomText extends BaseText {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
  fontFamily?: string;
  fontSize?: number;
}
/**
 * @param format - The format applied when the button is clicked
 * @param icon - The icon to display on the button
 * @param showHoverEffect - Whether to show a hover effect on the button
 * @param color - The color of the icon when the button is not active
 * @param activeColor - The color of the icon when the button is active
 * @param disabled - Whether the button is disabled
 * @param isSelectOption - Whether the button is used within a select component as an option
 */
export interface ToolbarButtonProps {
  format: keyof typeof TOOLBAR_TOOLTIP_MAPPINGS;
  icon: IconType;
  showHoverEffect?: boolean;
  color?: string;
  activeColor?: string;
  disabled?: boolean;
  isSelectOption?: boolean;
}

export interface BaseProps {
  className?: string; // Explicitly type className as optional string
  children?: ReactNode;
  [key: string]: any; // Allow additional props
}

type OrNull<T> = T | null;

export interface ButtonProps extends BaseProps {
  active: boolean;
  format: keyof typeof TOOLBAR_TOOLTIP_MAPPINGS;
  showHoverEffect?: boolean;
}

// If slate editor starts not working, try to add these lines to Slate Editor file
declare module "slate" {
  interface CustomTypes {
    Text: CustomText;
  }
}

declare module "slate" {
  interface CustomTypes {
    Element: CustomElement;
  }
}
