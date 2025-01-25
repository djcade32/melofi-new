import React, { useEffect, useRef, useState } from "react";
import styles from "./searchInput.module.css";

interface SearchInputProps {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSubmit: () => Promise<boolean>;
}

const SearchInput = ({ id, value, placeholder, onChange, onSubmit }: SearchInputProps) => {
  const goRef = useRef<HTMLInputElement>(null);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEnter = (event: KeyboardEvent) => {
      if (event.key === "Enter" && goRef.current) {
        goRef.current.click();
      }
    };
    document.getElementById(`${id}-search-input`)?.addEventListener("keydown", handleEnter, true);
  }, []);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    onChange(event.target.value);
  };

  const handleOnSubmit = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const validLink = await onSubmit();
      setError(!validLink);
    } catch (error) {
      console.log(error);
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
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        style={{ borderColor: error ? "var(--color-error)" : "" }}
      />
      <p
        id={`${id}-search-input-go`}
        ref={goRef}
        className={styles.searchInput__input_button}
        onClick={handleOnSubmit}
      >
        Go
      </p>
    </div>
  );
};

export default SearchInput;
