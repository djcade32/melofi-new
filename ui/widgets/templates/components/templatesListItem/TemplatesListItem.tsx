import React, { useCallback, useEffect, useState } from "react";
import styles from "./templatesListItem.module.css";
import { RiPlayListFill, MdLandscape, BsSoundwave, HiTrash } from "@/imports/icons";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import { Template } from "@/types/interfaces/templates";
import useTemplatesStore from "@/stores/widgets/templates-store";
import { Sound } from "@/types/interfaces/mixer";

interface TemplatesListItemProps {
  template: Template;
}

const TemplatesListItem = ({ template }: TemplatesListItemProps) => {
  const [hovered, setHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [templateSounds, setTemplateSounds] = useState<Sound[] | undefined>(undefined);
  const { selectedTemplate, setSelectedTemplate, deleteTemplate } = useTemplatesStore();

  // Update templateSounds whenever template changes
  useEffect(() => {
    const mixerSoundConfigArray = Object.values(template.mixerSoundConfig);
    const sounds = mixerSoundConfigArray.filter((sound) => sound.volume > 0);
    setTemplateSounds(sounds);
  }, []);

  const getSoundIcons = useCallback(() => {
    return (
      <div id="templatesListItem-icons" style={{ display: "flex", gap: 3, alignItems: "center" }}>
        {templateSounds?.map((sound) => (
          <div key={sound.name} className={styles.templatesListItem__icon_container}>
            {React.createElement(sound.icon, {
              size: 15,
              color: "var(--color-white)",
            })}
          </div>
        ))}
      </div>
    );
  }, [templateSounds]);

  const isActive = useCallback(() => {
    return selectedTemplate?.id === template.id;
  }, [selectedTemplate, template]);

  const animateSoundIconsSettings = useCallback(() => {
    if (hoveredIndex === 2) {
      return !!templateSounds?.length;
    }
    return true;
  }, [hoveredIndex, templateSounds]);

  const handleDeleteTemplate = async (e: MouseEvent) => {
    e.stopPropagation();
    await deleteTemplate(template.id);
  };

  const settings = [
    {
      icon: <RiPlayListFill size={20} color="var(--color-effect-opacity)" />,
      text: <p>{template.playlistName}</p>,
    },
    {
      icon: <MdLandscape size={20} color="var(--color-effect-opacity)" />,
      text: (
        <p
          style={{
            fontFamily: template.scene.fontFamily,
          }}
        >
          {template.scene.name}
        </p>
      ),
    },
    {
      icon: <BsSoundwave size={20} color="var(--color-effect-opacity)" />,
      text: getSoundIcons(),
    },
  ];

  return (
    <div
      id={`template-item-${template.id}`}
      className={styles.templatesListItem__container}
      style={{
        borderColor: isActive() ? "var(--color-effect-opacity)" : "var(--color-secondary)",
        opacity: isActive() || hovered ? 1 : 0.5,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setSelectedTemplate(template)}
    >
      <div
        style={{
          backgroundImage: `url(${template.scene.thumbnail})`,
        }}
        className={styles.templatesListItem__background_image}
      />
      <div className={styles.templatesListItem__content}>
        <div className={styles.templatesListItem__titleContainer}>
          <p className={styles.templatesListItem__title}>{template.name}</p>
          <HoverIcon
            id="templatesListItem-trash-icon"
            iconContainerClassName={styles.templatesListItem__trash_icon}
            size={20}
            color="var(--color-secondary)"
            icon={HiTrash}
            hoverColor="var(--color-error)"
            onClick={handleDeleteTemplate}
          />
        </div>
        <div className={styles.templatesListItem__settingsContainer}>
          {settings.map((setting, index) => (
            <div
              key={index}
              className={`${styles.templatesListItem__settings}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                flexGrow: hoveredIndex === index && animateSoundIconsSettings() ? 6.5 : 1,
                width: hoveredIndex === index && animateSoundIconsSettings() ? 100 : 5,
              }}
            >
              <div className={styles.templatesListItem__icon_container}>{setting.icon}</div>
              {setting.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatesListItem;
