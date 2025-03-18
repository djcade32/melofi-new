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
        let idx = parseInt(quoteObj.id) + 1;
        idx = idx >= Quotes.length ? 0 : idx;
        const quote = {
          dateAdded: new Date(),
          author: Quotes[idx].author,
          id: Quotes[idx].id,
          text: Quotes[idx].text,
        };

        set({ quote });
        localStorage.setItem("quote", JSON.stringify(quote));
        return;
      }
      set({ quote: { id: quoteObj.id, text: quoteObj.text, author: quoteObj.author } });
    } else {
      const quote = {
        dateAdded: new Date(),
        author: Quotes[0].author,
        id: Quotes[0].id,
        text: Quotes[0].text,
      };
      // If there isn't a quote, set a random quote
      set({ quote });
      localStorage.setItem("quote", JSON.stringify(quote));
    }
  },
}));

export default useQuoteDisplayStore;
