import React, { useEffect, useRef, useState } from "react";
import styles from "./addTemplateModal.module.css";
import Input from "@/ui/components/shared/input/Input";
import Button from "@/ui/components/shared/button/Button";
import useTemplatesStore from "@/stores/widgets/templates-store";
import { Template } from "@/types/interfaces/templates";
interface AddTemplateModalProps {
  isOpen: boolean;
  close: () => void;
}

const AddTemplateModal = ({ isOpen, close }: AddTemplateModalProps) => {
  const { createTemplate } = useTemplatesStore();
  const inputTitleRef = useRef<HTMLInputElement>(null);
  const [templateName, setTemplateName] = useState("");

  useEffect(() => {
    if (isOpen) {
      inputTitleRef.current?.focus();
    }
  }, [isOpen]);

  const handleAddTemplate = async () => {
    await createTemplate(templateName.trim());
    close();
    setTemplateName("");
  };

  const handleClose = () => {
    close();
    setTemplateName("");
  };

  return (
    <div
      className={styles.addTemplate__container}
      style={{
        opacity: isOpen ? 1 : 0,
        zIndex: isOpen ? 2 : -1,
      }}
    >
      <div>
        <p className={styles.addTemplate__title}>Template name</p>
        <Input
          ref={inputTitleRef}
          className={styles.addTemplate__title_input}
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && templateName) {
              handleAddTemplate();
            }
          }}
        />
      </div>
      <div className={styles.addTemplate__action_buttons_container}>
        <Button
          id="cancel-template-button"
          text="Cancel"
          onClick={handleClose}
          containerClassName={styles.addTemplate__add_task_button}
          style={{
            backgroundColor: "transparent",
          }}
          textClassName={styles.addTemplate__cancel_button_text}
        />
        <Button
          disable={!templateName.trim()}
          id="add-template-button"
          text="Add"
          onClick={handleAddTemplate}
          containerClassName={styles.addTemplate__add_task_button}
        />
      </div>
    </div>
  );
};

export default AddTemplateModal;
