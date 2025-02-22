import Modal from "@/ui/components/shared/modal/Modal";
import React from "react";
import styles from "./insightsModal.module.css";
import useMenuStore from "@/stores/menu-store";

import FocusStatsSection from "./section/focusStatsSection/FocusStatsSection";

const InsightsModal = () => {
  const { selectedOption, setSelectedOption } = useMenuStore();
  const isOpenState = selectedOption === "Insights";

  return (
    <Modal
      id="insights-modal"
      className={styles.insightsModal__container}
      isOpen={isOpenState}
      close={() => setSelectedOption(null)}
      title="INSIGHTS"
      titleClassName={styles.insightsModal__title}
    >
      <div className={styles.insightsModal__content}>
        <p className={styles.insightsModal__subtitle}>Track your progress and stay motivated!</p>
        <div className={styles.insightsModal__section}>
          <p className={styles.insightsModal__section_title}>⏳ Focus Stats</p>
          <FocusStatsSection />
        </div>
      </div>
    </Modal>
  );
};

export default InsightsModal;
