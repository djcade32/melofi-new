import Modal from "@/ui/components/shared/modal/Modal";
import React from "react";
import styles from "./insightsModal.module.css";
import useMenuStore from "@/stores/menu-store";

const InsightsModal = () => {
  const { selectedOption, setSelectedOption } = useMenuStore();
  const isOpenState = selectedOption === "Insights";

  return (
    <Modal
      id="insights-modal"
      className={styles.insightsModal__container}
      isOpen={isOpenState}
      close={() => setSelectedOption(null)}
      title="Insights"
      titleClassName={styles.insightsModal__title}
    >
      <p>Track your progress and stay motivated!</p>
    </Modal>
  );
};

export default InsightsModal;
