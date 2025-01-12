import React, { forwardRef, useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
  styled,
  SelectProps as MuiSelectProps,
  SelectProps,
} from "@mui/material";
import { cx, css } from "@emotion/css";
import Tooltip from "@/ui/components/shared/tooltip/Tooltip";
import { LongMenuOption, LongMenuRenderedOption } from "@/types/general";
import { ToolbarButtonProps } from "@/types/interfaces/slate_editor";

interface LongMenuProps {
  id: string;
  options: LongMenuOption[] | LongMenuRenderedOption[];
  onSelected: (option: LongMenuOption) => void;
  selectedOption: LongMenuOption | LongMenuRenderedOption;
  horizontal?: boolean;
  optionsContainerStyle?: React.CSSProperties;
  optionItemStyle?: React.CSSProperties;
  selectorStyle?: React.CSSProperties;
  showOptionHoverEffect?: boolean;
  showSelectedOptionHoverEffect?: boolean;
  className?: string;
  tooltipText: string;
  defaultOption?: LongMenuOption | LongMenuRenderedOption;
  onClose?: () => void;
}

const Selector = ({
  id,
  options,
  onSelected,
  selectedOption,
  horizontal = false,
  optionsContainerStyle,
  optionItemStyle,
  selectorStyle,
  showOptionHoverEffect = true,
  showSelectedOptionHoverEffect = true,
  className,
  tooltipText,
  defaultOption,
  onClose,
}: LongMenuProps) => {
  // Styled MenuItem for custom hover behavior
  const StyledMenuItem = styled(MenuItem)(() => ({
    ...optionItemStyle,
    "&:hover": {
      backgroundColor: showOptionHoverEffect ? "var(--color-secondary-opacity)" : "transparent",
    },
    "&.Mui-selected": {
      color: "var(--color-selected-text) !important", // Text color for selected option
      backgroundColor: showSelectedOptionHoverEffect
        ? "var(--color-effect-opacity) !important"
        : "transparent !important",
      "&:hover": {
        backgroundColor: showSelectedOptionHoverEffect
          ? "var(--color-effect-opacity) !important"
          : "transparent !important",
      },
    },
  }));

  // Custom styling for the dropdown
  const StyledSelect = styled(
    forwardRef<HTMLDivElement, SelectProps>((props: MuiSelectProps, ref) => (
      <Select
        ref={ref}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          PaperProps: {
            sx: {
              backgroundColor: "var(--color-primary-opacity)",
              borderRadius: "10px !important",
              color: "var(--color-white)",
              boxShadow: "var(--box-shadow-primary)",
              ".MuiList-root": {
                display: horizontal ? "flex " : "block",
                gap: 1,
                padding: 1,
              },
              ...optionsContainerStyle,
            },
          },
        }}
        {...props}
      />
    ))
  )(() => ({
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      color: "var(--color-secondary-white)", // Default text color for selected value
      ...selectorStyle,
      "&:hover": {
        backgroundColor: "var(--color-secondary-opacity)", // Hover color for selector
      },
    },
    "& .MuiMenuItem-root": {
      ...optionItemStyle,
    },
    "& .MuiSelect-icon": {
      color: "var(--color-secondary-white)", // Dropdown arrow color
    },
    "& .MuiSelect-select[aria-expanded='true']": {
      color: "var(--color-secondary-white)", // Text color when dropdown is open
    },
    // Remove border and outline
    "&.MuiInputBase-root": {
      border: "none",
      outline: "none",
      marginLeft: "0px !important",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&:focus": {
      outline: "none",
    },
  }));

  return (
    <StyledSelect
      id={id}
      onClose={onClose}
      value={selectedOption.label}
      onChange={(event) => {
        const selected = options?.find((option) => option.label === event.target.value);
        if (selected) onSelected(selected);
      }}
      displayEmpty
      renderValue={() =>
        "element" in selectedOption ? (
          React.isValidElement(selectedOption.element) ? (
            React.cloneElement(selectedOption.element, {
              activeColor: "var(--color-secondary-white)",
              showHoverEffect: false,
              disabled: true,
            } as ToolbarButtonProps)
          ) : null
        ) : (
          <Tooltip offset={[0, 8]} noFlex text={tooltipText} tooltipClassName={cx(className)}>
            <p style={{ color: "var(--color-secondary-white)" }}>{selectedOption.label} </p>
          </Tooltip>
        )
      }
    >
      {options &&
        options.map((option) => (
          <StyledMenuItem key={option.id} value={option.label}>
            {"element" in option ? (
              <ListItemIcon>{option.element}</ListItemIcon>
            ) : (
              <ListItemText
                primary={
                  <p
                    style={{
                      color:
                        selectedOption.label === option.label
                          ? "var(--color-white)"
                          : "var(--color-secondary-white)",
                      fontFamily: option.label,
                    }}
                  >
                    {option.label}
                  </p>
                }
              />
            )}
          </StyledMenuItem>
        ))}
    </StyledSelect>
  );
};

export default Selector;
