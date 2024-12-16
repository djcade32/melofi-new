import React, { useRef, useState, useEffect } from "react";
import styles from "./toolbar.module.css";
import useToolsStore from "@/stores/tools-store";
import {
  CgArrowsExpandDownRight,
  CgArrowsExpandUpLeft,
  LuGalleryHorizontal,
  LuGalleryVertical,
  MdMoreHoriz,
  RxDragHandleDots2,
} from "@/imports/icons";
import Menu from "@/ui/components/shared/menu/Menu";
import Draggable from "react-draggable";
import { MenuOption } from "@/types/interfaces";
import ToolbarWidgetButtons from "./toolbarWidgetButtons/ToolbarWidgetButtons";

const iconProps = {
  size: 20,
  color: "var(--color-primary-opacity)",
  style: { cursor: "pointer" },
};

const Toolbar = () => {
  const nodeRef = useRef(null);
  const { isToolsOpen, isUndocked, toggleUndocked, isVertical, toggleVertical } = useToolsStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // State to track toolbar's position
  const [position, setPosition] = useState({ x: 0, y: 45 }); // y: 45px for initial docked position

  const options: MenuOption[] = [
    {
      id: "menu-option-1",
      label: isUndocked ? "Dock" : "Undock",
      icon: isUndocked ? (
        <CgArrowsExpandUpLeft size={20} color="var(--color-primary-opacity)" />
      ) : (
        <CgArrowsExpandDownRight size={20} color="var(--color-primary-opacity)" />
      ),
      onClick: () => {
        toggleUndocked(!isUndocked);
        handleClose();
      },
    },
    {
      id: "menu-option-2",
      label: isVertical ? "Horizontal" : "Vertical",
      icon: isVertical ? (
        <LuGalleryHorizontal size={20} color="var(--color-primary-opacity)" />
      ) : (
        <LuGalleryVertical size={20} color="var(--color-primary-opacity)" />
      ),
      onClick: () => {
        toggleVertical(!isVertical);
        handleClose();
      },
    },
  ];

  // Update the position state when the toolbar is docked
  useEffect(() => {
    if (!isUndocked) {
      // Reset the toolbar to its original docked position
      setPosition({ x: 0, y: 0 });
    } else {
      // Reset the toolbar to its original undocked position
      setPosition({ x: 0, y: 45 });
    }
  }, [isUndocked]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  // Handle dragging and update the position state
  const handleDrag = (e: any, data: any) => {
    if (isUndocked) {
      setPosition({ x: data.x, y: data.y });
    }
  };

  return (
    <>
      {isToolsOpen && (
        <Draggable
          disabled={!isUndocked}
          nodeRef={nodeRef}
          position={isUndocked ? position : { x: 0, y: 45 }} // Use position when undocked, otherwise reset to docked position
          onDrag={handleDrag}
          handle="#toolbar-handle"
        >
          <div
            id="toolbar"
            ref={nodeRef}
            className={`${styles.toolbar__container} ${
              isVertical ? styles.vertical : styles.horizontal
            }`}
          >
            {isUndocked && (
              <RxDragHandleDots2
                id="toolbar-handle"
                size={30}
                color="var(--color-secondary)"
                style={{ cursor: "all-scroll", rotate: isVertical ? "90deg" : "0deg" }}
              />
            )}
            <ToolbarWidgetButtons />
            <div onClick={handleClick} style={{ display: "flex", alignItems: "center" }}>
              <MdMoreHoriz
                id="toolbar-more-button"
                size={25}
                color="var(--color-secondary)"
                style={{ cursor: "pointer", rotate: isVertical ? "90deg" : "0deg" }}
              />
            </div>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} options={options} />
          </div>
        </Draggable>
      )}{" "}
    </>
  );
};

export default Toolbar;
