import useMenuStore from "@/stores/menu-store";
import Modal from "@/ui/components/shared/modal/Modal";
import React from "react";
import styles from "./changeLog.module.css";
import ChangeLogCard from "./components/changeLogCard/ChangeLogCard";
import CHANGE_LOG_DATA from "@/data/changeLog.json";
import { ChangeLog as ChangeLogType } from "@/types/general";

const ChangeLog = () => {
  const { selectedOption, setSelectedOption } = useMenuStore();
  const isOpen = selectedOption === "Change Log";

  return (
    <Modal
      id="share-modal"
      className={styles.changeLog__container}
      isOpen={isOpen}
      close={() => setSelectedOption(null)}
      title="CHANGE LOG"
      titleClassName={styles.changeLog__title}
    >
      <div className={styles.changeLog__content}>
        {CHANGE_LOG_DATA.map((changeLog: ChangeLogType, index: number) => (
          <ChangeLogCard
            key={index}
            version={changeLog.version}
            date={changeLog.date}
            newFeatures={changeLog.newFeatures}
            improvements={changeLog.improvements}
            bugFixes={changeLog.bugFixes}
            latest={index === 0}
          />
        ))}
      </div>
    </Modal>
  );
};

export default ChangeLog;
