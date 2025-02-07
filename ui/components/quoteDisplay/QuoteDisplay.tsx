import React, { useEffect } from "react";
import styles from "./quoteDisplay.module.css";
import useQuoteDisplayStore from "@/stores/quote-display-store";

const QuoteDisplay = () => {
  const { quote, getQuote } = useQuoteDisplayStore();

  useEffect(() => {
    getQuote();
  }, []);

  if (!quote) {
    return <></>;
  }

  return (
    <div className={styles.quoteDisplay__container}>
      <p className={styles.quoteDisplay__text}>{`"${quote.text}"`}</p>
      {quote.author && <p className={styles.quoteDisplay__author}>{`- ${quote.author}`}</p>}
    </div>
  );
};

export default QuoteDisplay;
