import React, { useEffect, useRef, useState } from "react";
import styles from "./searchInput.module.css";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("Search Input");

interface SearchInputProps {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSubmit: () => Promise<boolean>;
  inputBorderRadius?: number;
  onFocus?: () => void;
  onBlur?: () => void;
}

const SearchInput = ({
  id,
  value,
  placeholder,
  onChange,
  onSubmit,
  inputBorderRadius,
  onFocus,
  onBlur,
}: SearchInputProps) => {
  const goRef = useRef<HTMLInputElement>(null);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    onChange(event.target.value);
  };

  const handleOnSubmit = async (): Promise<void> => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const validLink = await onSubmit();
      setError(!validLink);
    } catch (error) {
      Logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.searchInput__input_container}>
      <input
        id={`${id}-search-input`}
        className={`${styles.searchInput__input} ${
          isInputFocused && styles.searchInput__input_focused
        }`}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleOnChange}
        onFocus={() => {
          setIsInputFocused(true);
          onFocus && onFocus();
        }}
        onBlur={() => {
          setIsInputFocused(false);
          onBlur && onBlur();
        }}
        style={{
          borderColor: error ? "var(--color-error)" : "",
          borderTopLeftRadius: inputBorderRadius,
          borderBottomLeftRadius: inputBorderRadius,
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleOnSubmit();
          }
        }}
      />
      <p
        id={`${id}-search-input-go`}
        ref={goRef}
        className={styles.searchInput__input_button}
        onClick={handleOnSubmit}
        style={{
          borderTopRightRadius: inputBorderRadius,
          borderBottomRightRadius: inputBorderRadius,
        }}
      >
        Go
      </p>
    </div>
  );
};

export default SearchInput;
