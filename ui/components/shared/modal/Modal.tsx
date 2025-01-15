"use client";

import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import styles from "./modal.module.css";
import { IoCloseOutline } from "@/imports/icons";

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
  ...props
}: ModalProps) => {
  const nodeRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Draggable disabled={!draggable} nodeRef={nodeRef} handle="#handle">
      <div
        ref={nodeRef}
        className={`${styles.modal__container} ${className}`}
        style={{ ...props?.style, display: isOpen ? "flex" : "none" }}
        id={id}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={props.tabIndex}
      >
        {draggable && <div id="handle" className={styles.modal__dragHandle} />}
        <div
          className={styles.modal__backdrop}
          style={{
            opacity: showBackdrop ? 1 : 0,
            zIndex: showBackdrop ? 2 : -1,
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
    </Draggable>
  );
};

export default Modal;
