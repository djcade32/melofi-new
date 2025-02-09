"use client";

import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import styles from "./modal.module.css";
import { IoCloseOutline } from "@/imports/icons";
import "react-resizable/css/styles.css"; // Import default styles for react-resizable
import { FiMaximize2 } from "@/imports/icons";
import { use } from "chai";
import { wait } from "@/utils/general";

interface ModalProps extends React.HTMLProps<HTMLDivElement> {
  isOpen: boolean;
  children: React.ReactNode;
  showCloseIcon?: boolean;
  close?: () => void;
  title?: string;
  titleClassName?: string;
  className?: string;
  draggable?: boolean;
  id?: string;
  fadeCloseIcon?: boolean;
  showBackdrop?: boolean;
  resizable?: boolean;
  onResizing?: () => void;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
  onDrag?: () => void;
  onStop?: () => void;
}

const Modal = ({
  isOpen,
  children,
  showCloseIcon = true,
  close,
  title,
  titleClassName,
  className,
  draggable = false,
  id,
  fadeCloseIcon = false,
  showBackdrop = false,
  resizable = false,
  onResizing,
  onMouseOver,
  onMouseLeave,
  onDrag,
  onStop,
  ...props
}: ModalProps) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 225 }); // Default dimensions

  useEffect(() => {
    // Get the width and height of the modal
    // and set it to the dimensions
    if (isOpen) {
      setDimensionsOnOpen();
      fixIfExpandingOffScreen();
    }
  }, [isOpen, className]);

  const setDimensionsOnOpen = async () => {
    // Wait for pomodoro timer widgets animation to finish
    id?.includes("pomodoro-timer-widget") && (await wait(500));
    if (id?.includes("youtube-widget")) {
      return;
    }
    nodeRef.current &&
      setDimensions({
        width: nodeRef.current.clientWidth,
        height: nodeRef.current.clientHeight,
      });
  };

  const onResize = (e: React.SyntheticEvent, data: any) => {
    setDimensions({
      width: data.size.width,
      height: data.size.height,
    });
    onResizing && onResizing();
  };

  const fixIfExpandingOffScreen = async () => {
    await wait(500);
    // Check if widget is expanding off screen
    const widget = nodeRef.current;
    if (widget) {
      const widgetRect = widget.getBoundingClientRect();

      if (widgetRect.top < 0) {
        // Move widget to top
        widget.style.transform = `translateY(${Math.abs(widgetRect.top)}px)`;
      }
    }
  };

  const handle = (
    <div
      className={styles.customResizeHandle}
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 20,
        height: 20,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        cursor: "nwse-resize",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FiMaximize2
        size={15}
        color="var(--color-white)"
        style={{
          transform: "rotate(90deg)",
        }}
      />
    </div>
  );

  const modalContent = (
    <div
      ref={nodeRef}
      className={`${styles.modal__container} ${className}`}
      style={{
        ...props?.style,
        display: isOpen ? "flex" : "none",
        width: resizable ? `${dimensions.width}px` : props.style?.width,
        height: resizable ? `${dimensions.height}px` : props.style?.height,
      }}
      id={id}
      onMouseEnter={() => {
        setIsHovered(true);
        onMouseOver && onMouseOver();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onMouseLeave && onMouseLeave();
      }}
      tabIndex={props.tabIndex}
    >
      {draggable && <div id="handle" className={styles.modal__dragHandle} />}
      <div
        className={styles.modal__backdrop}
        style={{
          opacity: showBackdrop ? 1 : 0,
          zIndex: showBackdrop ? 10 : -1,
        }}
      />

      <div
        className={styles.modal__title_container}
        id={draggable ? "handle" : ""}
        style={draggable ? { cursor: "all-scroll" } : {}}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {title && <p className={`${titleClassName}`}>{title}</p>}
        </div>
        {showCloseIcon && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IoCloseOutline
              id={`${id}-close-icon`}
              size={25}
              color="var(--color-secondary)"
              onClick={close}
              style={{
                cursor: "pointer",
                zIndex: 1,
                opacity: fadeCloseIcon ? (isHovered ? 1 : 0) : 1,
                transition: "all 0.3s",
              }}
            />
          </div>
        )}
      </div>

      {children}
    </div>
  );

  return (
    <Draggable
      disabled={!draggable}
      nodeRef={nodeRef}
      handle="#handle"
      onDrag={onDrag}
      onStop={onStop}
      bounds={{
        left: -(window.innerWidth - dimensions.width) / 2,
        top: -(window.innerHeight - dimensions.height) / 2,
        right: (window.innerWidth - dimensions.width) / 2,
        bottom: (window.innerHeight - dimensions.height) / 2,
      }}
    >
      {resizable ? (
        <Resizable
          width={dimensions.width}
          height={dimensions.height}
          onResize={onResize}
          minConstraints={[400, 225]} // Minimum size [width, height]
          maxConstraints={[800, 450]} // Maximum size [width, height]
          handle={handle}
          axis="both"
        >
          {modalContent}
        </Resizable>
      ) : (
        modalContent
      )}
    </Draggable>
  );
};

export default Modal;
