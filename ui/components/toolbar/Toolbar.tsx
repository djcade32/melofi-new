import React, { useRef, useState, useEffect, useMemo } from "react";
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
import { MenuOption } from "@/types/general";
import ToolbarWidgetButtons from "./toolbarWidgetButtons/ToolbarWidgetButtons";
import { wait } from "@/utils/general";
import { useAppContext } from "@/contexts/AppContext";
import useUserStore from "@/stores/user-store";
import useAppStore from "@/stores/app-store";

const Toolbar = () => {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const {
    isToolsOpen,
    isUndocked,
    toggleUndocked,
    isVertical,
    toggleVertical,
    fetchToolbarSettings,
    onToolbarDragEnd,
    toolbarPosition,
    setToolbarPosition,
    toggleTools,
    setOriginalDockedPosition,
  } = useToolsStore();
  const { isSleep } = useAppContext();
  const { isPremiumUser } = useUserStore();
  const { setShowPremiumModal } = useAppStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const dimensionsRef = useMemo(() => {
    let width = 359;
    let height = 44;
    if (!isVertical) {
      if (isUndocked) {
        width += 30;
      }
    } else {
      if (isUndocked) {
        height = width + 30;
      }
      width = 44;
    }
    return {
      width,
      height,
    };
  }, [isUndocked, isVertical]);

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
        if (!isPremiumUser) {
          setShowPremiumModal("toolbar_settings");
          handleClose();
          return;
        }
        toggleUndocked(!isUndocked);
        handleClose();
      },
      showPremiumIcon: isPremiumUser === false,
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
        if (!isPremiumUser) {
          setShowPremiumModal("toolbar_settings");
          handleClose();
          return;
        }
        toggleVertical(!isVertical);
        handleClose();
      },
      showPremiumIcon: isPremiumUser === false,
    },
  ];

  useEffect(() => {
    // Fetch the toolbar settings from local storage
    fetchToolbarSettings();
    const updateDimension = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, []);

  useEffect(() => {
    if (isSleep) {
      !isUndocked && toggleTools(false);
    }
  }, [isSleep]);

  // Update the position state when the toolbar is docked
  useEffect(() => {
    const toolbarButtonRect = document.getElementById("tools-button")?.getBoundingClientRect();

    if (toolbarButtonRect) {
      // Reset the toolbar to its original docked position
      if (!isUndocked) {
        const dockedPosition = {
          x: toolbarButtonRect.left - (dimensionsRef.width - toolbarButtonRect.width) / 2,
          y: -35,
        };
        setToolbarPosition(dockedPosition);
        setOriginalDockedPosition(dockedPosition);
      } else {
        // Reset the toolbar to its original undocked position
        setToolbarPosition({
          x: toolbarPosition.x,
          y: toolbarPosition.y,
        });
      }
    }
    fixIfExpandingOffScreen();
  }, [isUndocked, windowDimensions.width, isVertical]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleOnStop = (e: any, data: any) => {
    const { x, y } = data;
    onToolbarDragEnd({ x, y });
  };

  const fixIfExpandingOffScreen = async () => {
    await wait(500);
    // Check if widget is expanding off screen
    const toolbar = nodeRef.current;
    if (toolbar) {
      const toolbarRect = toolbar.getBoundingClientRect();

      if (toolbarRect.right > windowDimensions.width) {
        setToolbarPosition({
          x: windowDimensions.width - dimensionsRef.width,
          y: toolbarPosition.y,
        });
      }
      if (toolbarRect.bottom > windowDimensions.height) {
        setToolbarPosition({
          x: toolbarPosition.x,
          y: windowDimensions.height - dimensionsRef.height - 126,
        });
      }
    }
  };

  return (
    <>
      {isToolsOpen && (
        <Draggable
          disabled={!isUndocked}
          nodeRef={nodeRef}
          position={toolbarPosition} // Use position when undocked, otherwise reset to docked position
          handle="#toolbar-handle"
          onStop={handleOnStop}
          bounds="#melofi-app"
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
      )}
    </>
  );
};

export default Toolbar;
