"use client";

import React, { useMemo } from "react";
import styles from "./quoteDisplay.module.css";
import useQuoteDisplayStore from "@/stores/quote-display-store";
import { useAppContext } from "@/contexts/AppContext";
import useAppStore from "@/stores/app-store";
import useUserStore from "@/stores/user-store";

const QuoteDisplay = () => {
  const { quote, getQuote } = useQuoteDisplayStore();
  const { isSleep } = useAppContext();
  const { appSettings } = useAppStore();
  const { isPremiumUser } = useUserStore();

  const scheduleQuoteUpdate = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set to next midnight

    const timeUntilMidnight = midnight.getTime() - now.getTime();

    setTimeout(() => {
      getQuote(); // Fetch new quote at midnight
      scheduleQuoteUpdate(); // Re-schedule for the next day
    }, timeUntilMidnight);
  };

  useMemo(() => {
    getQuote();
    scheduleQuoteUpdate();
  }, []);

  if (!quote) {
    return <></>;
  }

  return (
    <>
      {appSettings.showDailyQuote && isPremiumUser && (
        <div
          className={`${styles.quoteDisplay__container} ${
            isSleep ? styles.slide_down : styles.slide_up
          }`}
        >
          <p className={styles.quoteDisplay__text}>{`"${quote.text}"`}</p>
          {quote.author && <p className={styles.quoteDisplay__author}>{`- ${quote.author}`}</p>}
        </div>
      )}
    </>
  );
};

export default QuoteDisplay;
