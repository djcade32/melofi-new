import React, { useEffect } from "react";
import styles from "./quoteDisplay.module.css";
import useQuoteDisplayStore from "@/stores/quote-display-store";
import useAppStore from "@/stores/app-store";

const QuoteDisplay = () => {
  const { quote, getQuote } = useQuoteDisplayStore();
  const { isSleep } = useAppStore();

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

  useEffect(() => {
    getQuote();
    scheduleQuoteUpdate();
  }, []);

  if (!quote) {
    return <></>;
  }

  return (
    <div
      className={`${styles.quoteDisplay__container} ${
        isSleep ? styles.slide_down : styles.slide_up
      }`}
    >
      <p className={styles.quoteDisplay__text}>{`"${quote.text}"`}</p>
      {quote.author && <p className={styles.quoteDisplay__author}>{`- ${quote.author}`}</p>}
    </div>
  );
};

export default QuoteDisplay;
