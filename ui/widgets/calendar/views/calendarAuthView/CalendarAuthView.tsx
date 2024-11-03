import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import React from "react";
import { AiOutlineGoogle, BsInfoCircle } from "@/imports/icons";
import styles from "./calendarAuthView.module.css";
import Button from "@/ui/components/shared/button/Button";

interface CalendarAuthViewProps {
  login: () => void;
}

const CalendarAuthView = ({ login }: CalendarAuthViewProps) => {
  return (
    <div className={styles.calendarAuthView__container}>
      <div
        style={{
          display: "flex",
          columnGap: 10,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <p className={styles.calendarAuthView__no_event}>No events to view</p>
        <HoverIcon
          icon={BsInfoCircle}
          size={20}
          tooltipText="Connect your Google Calendar to view events"
          showTooltip
        />
      </div>
      <Button
        id="google-login-button"
        text="Continue with Google"
        textClassName={styles.calendarAuthView__google_login_button_text}
        onClick={login}
        prependIcon={AiOutlineGoogle}
        style={{ backgroundColor: "var(--color-effect-opacity)" }}
      />
    </div>
  );
};

export default CalendarAuthView;
