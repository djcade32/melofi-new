import useUserStore from "@/stores/user-store";
import AccountModalSignedInUser from "./views/AccountModalSignedInUser";
import Modal from "@/ui/components/shared/modal/Modal";
import styles from "./accountModal.module.css";
import { useState } from "react";
import useMenuStore from "@/stores/menu-store";
import AccountModalSkippedUser from "./views/accountModalSkippedUser/AccountModalSkippedUser";
import { IoCloseOutline } from "@/imports/icons";

const AccountModal = () => {
  const { currentUser, isUserLoggedIn } = useUserStore();
  const { setSelectedOption, selectedOption } = useMenuStore();
  const [showReauthenticateModal, setShowReauthenticateModal] = useState(false);
  const isOpenState = selectedOption === "Account";

  const handleBackDropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.target === e.currentTarget && !showReauthenticateModal && setSelectedOption(null);
  };

  const getTitle = () => {
    return currentUser?.skippedOnboarding || !isUserLoggedIn ? "" : "Account";
  };

  const getHeight = () => {
    return currentUser?.skippedOnboarding || !isUserLoggedIn ? 650 : 475;
  };
  return (
    <div
      id="account-modal-backdrop"
      onClick={handleBackDropClick}
      className={styles.accountModal__backdrop}
      style={{
        opacity: isOpenState ? 1 : 0,
        zIndex: isOpenState ? 100 : -1,
      }}
    >
      <Modal
        id="account-modal"
        className={styles.accountModal__container}
        style={{
          height: getHeight(),
        }}
        isOpen={isOpenState}
        close={() => setSelectedOption(null)}
        showCloseIcon={false}
        showBackdrop={showReauthenticateModal}
      >
        <>
          <div className={styles.accountModal__header}>
            <p
              style={{
                fontSize: 21,
                fontWeight: 500,
              }}
            >
              {getTitle()}
            </p>
            <IoCloseOutline
              id="account-modal-close-button"
              size={25}
              color="var(--color-secondary)"
              onClick={() => setSelectedOption(null)}
              style={{
                cursor: "pointer",
                zIndex: 1,
                display: "flex",
                justifySelf: "flex-end",
              }}
            />
          </div>
          {currentUser?.skippedOnboarding || !isUserLoggedIn ? (
            <AccountModalSkippedUser />
          ) : (
            <AccountModalSignedInUser
              showReauthenticateModal={showReauthenticateModal}
              setShowReauthenticateModal={setShowReauthenticateModal}
            />
          )}
        </>
      </Modal>
    </div>
  );
};

export default AccountModal;
