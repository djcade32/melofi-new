import useTemplatesStore from "@/stores/widgets/templates-store";
import Modal from "@/ui/components/shared/modal/Modal";
import React, { useEffect, useState } from "react";
import styles from "./templates.module.css";
import TemplatesListItem from "./components/templatesListItem/TemplatesListItem";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import { FiPlus } from "@/imports/icons";
import AddTemplateModal from "./components/addTemplateModal/AddTemplateModal";

const Templates = () => {
  const { isTemplatesOpen, setIsTemplatesOpen, templateList, fetchTemplates } = useTemplatesStore();
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);

  useEffect(() => {
    const getTemplates = async () => {
      await fetchTemplates();
    };
    getTemplates();
  }, []);

  return (
    <Modal
      id="templates-widget"
      isOpen={isTemplatesOpen}
      className={styles.templates__container}
      title="TEMPLATES"
      draggable
      titleClassName={styles.templates__title}
      close={() => setIsTemplatesOpen(!isTemplatesOpen)}
      showBackdrop={showAddTemplateModal}
      isWidget
      name="templates"
    >
      <div className={styles.templates__content}>
        {templateList.map((template) => (
          <TemplatesListItem key={template.id} template={template} />
        ))}
        {templateList.length === 0 && (
          <div className={styles.templates__empty}>
            <p>No Templates</p>
          </div>
        )}
      </div>
      <HoverIcon
        icon={FiPlus}
        tooltipText="Add Template"
        showTooltip
        size={25}
        color="var(--color-white)"
        hoverColor="var(--color-secondary-white)"
        inverted
        invertedHoverColor="var(--color-secondary)"
        invertedBackgroundColor="#413F41"
        onClick={() => setShowAddTemplateModal(true)}
        iconContainerClassName={styles.templates__add_template_button}
        containerClassName={styles.templates__add_template_button_container}
      />

      <AddTemplateModal
        isOpen={showAddTemplateModal}
        close={() => setShowAddTemplateModal(false)}
      />
    </Modal>
  );
};

export default Templates;
