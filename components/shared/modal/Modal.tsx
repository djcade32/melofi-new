"use client";

import React, { useRef } from "react";
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
}: ModalProps) => {
  const nodeRef = useRef(null);

  return (
    <Draggable disabled={!draggable} nodeRef={nodeRef} handle="#handle">
      <div
        ref={nodeRef}
        className={`${styles.modal__container} ${className}`}
        style={{ display: isOpen ? "flex" : "none" }}
        id={id}
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
              style={{ cursor: "pointer", zIndex: 1 }}
            />
          )}
        </div>

        {children}
      </div>
    </Draggable>
  );
};

export default Modal;
