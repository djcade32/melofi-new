"use client";

import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import styles from "./modal.module.css";
import { IoCloseOutline } from "@/imports/icons";

interface ModalProps {
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
}: ModalProps) => {
  const nodeRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const closeIconComponent = () => {
    return (
      <IoCloseOutline
        size={25}
        color="var(--color-secondary)"
        onClick={close}
        style={{
          cursor: "pointer",
          zIndex: 1,
          opacity: fadeCloseIcon ? (isHovered ? 1 : 0.5) : 1,
        }}
      />
    );
  };

  return (
    <Draggable disabled={!draggable} nodeRef={nodeRef} handle="#handle">
      <div
        ref={nodeRef}
        className={`${styles.modal__container} ${className}`}
        style={{ display: isOpen ? "flex" : "none" }}
        id={id}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {draggable && <div id="handle" className={styles.modal__dragHandle} />}
        <div
          className={styles.modal__title_container}
          id={draggable ? "handle" : ""}
          style={draggable ? { cursor: "all-scroll" } : {}}
        >
          {title && <p className={`${titleClassName}`}>{title}</p>}
          {showCloseIcon && (
            <IoCloseOutline
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
          )}
        </div>

        {children}
      </div>
    </Draggable>
  );
};

export default Modal;
