import React, { DetailedHTMLProps, InputHTMLAttributes, useEffect, useState } from "react";
import styles from "./input.module.css";
import { BiSolidHide, BiSolidShow } from "@/imports/icons";
import { Error } from "@/types/interfaces";

interface InputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  prependIcon?: JSX.Element;
  postpendIcon?: JSX.Element;
  errorState?: Error[] | null;
}

const Input = ({ prependIcon, postpendIcon, errorState, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const hasError = (): Error | undefined => {
    return errorState?.find((error) => error.name === props.name);
  };

  useEffect(() => {
    setError(hasError());
  }, [errorState]);

  const getPostpendIcon = () => {
    if (props.type === "password") {
      return (
        <>
          {showPassword ? (
            <BiSolidShow
              size={25}
              color="var(--color-secondary-white)"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          ) : (
            <BiSolidHide
              size={25}
              color="var(--color-secondary-white)"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          )}
        </>
      );
    } else {
      return <div className={styles.input__postpendIcon}>{postpendIcon}</div>;
    }
  };
  return (
    <div>
      <div className={styles.input__container}>
        <div>{prependIcon}</div>
        <input
          {...props}
          style={{
            paddingLeft: prependIcon ? "30px" : "0px",
            paddingRight: postpendIcon ? "30px" : "0px",
            borderColor: error ? "var(--color-error)" : "var(--color-secondary-white)",
          }}
          type={showPassword ? "text" : props.type}
        />
        <div
          className={styles.input__postpendIcon_container}
          style={{
            cursor: props.type === "password" ? "pointer" : "default",
          }}
        >
          {getPostpendIcon()}
        </div>
      </div>
      {error && <p className={styles.input__error_text}>{error.message}</p>}
    </div>
  );
};

export default Input;
