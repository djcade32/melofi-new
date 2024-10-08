"use client";

import React, { useRef } from "react";
import Draggable from "react-draggable";
import styles from "./modal.module.css";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  draggable?: boolean;
  id?: string;
}

const Modal = ({ isOpen, children, className, draggable = false, id }: ModalProps) => {
  const nodeRef = useRef(null);

  return (
    <Draggable
      disabled={!draggable}
      nodeRef={nodeRef}
      handle="#handle"
      defaultClassName={styles.test}
    >
      <div
        ref={nodeRef}
        className={`${styles.modal__container} ${className}`}
        style={{ display: isOpen ? "flex" : "none" }}
        id={id}
      >
        {draggable && <div id="handle" className={styles.modal__dragHandle} />}

        {children}
      </div>
    </Draggable>
  );
};

export default Modal;
