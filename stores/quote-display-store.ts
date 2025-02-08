import { Quotes } from "@/data/quotes";
import { Quote } from "@/types/general";
import { isNewDay } from "@/utils/date";
import { create } from "zustand";

export interface QuoteDisplayState {
  isQuoteDisplayOpen: boolean;
  setIsQuoteDisplayOpen: (isQuoteDisplayOpen: boolean) => void;
  quote: Quote | null;

  getQuote: () => void;
}

const useQuoteDisplayStore = create<QuoteDisplayState>((set, get) => ({
  isQuoteDisplayOpen: false,
  setIsQuoteDisplayOpen: (isQuoteDisplayOpen: boolean) => set({ isQuoteDisplayOpen }),
  quote: null,

  getQuote: () => {
    // Check local storage for a quote
    // If there is a quote, set it
    let quote = localStorage.getItem("quote");
    if (quote) {
      const quoteObj = JSON.parse(quote);
      const dateAdded = new Date(quoteObj.dateAdded);
      // If the quote is from a different day, set a new quote
      if (isNewDay(dateAdded)) {
        const idx = quoteObj.id === Quotes.length ? 1 : parseInt(quoteObj.id) + 1;
        set({ quote: Quotes[idx] });
        localStorage.setItem("quote", JSON.stringify({ ...Quotes[idx], dateAdded: new Date() }));
      }
      set({ quote: { id: quoteObj.id, text: quoteObj.text, author: quoteObj.author } });
    } else {
      // If there isn't a quote, set a random quote
      set({ quote: Quotes[1] });
      localStorage.setItem("quote", JSON.stringify({ ...Quotes[1], dateAdded: new Date() }));
    }
  },
}));

export default useQuoteDisplayStore;
