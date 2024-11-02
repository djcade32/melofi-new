import React, { DetailedHTMLProps, InputHTMLAttributes, useState } from "react";
import styles from "./input.module.css";
import { BiSolidHide, BiSolidShow } from "@/imports/icons";

interface InputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  prependIcon?: JSX.Element;
  postpendIcon?: JSX.Element;
}

const Input = ({ prependIcon, postpendIcon, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
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
    <div className={styles.input__container}>
      <div>{prependIcon}</div>
      <input
        {...props}
        style={{
          paddingLeft: prependIcon ? "30px" : "0px",
          paddingRight: postpendIcon ? "30px" : "0px",
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
  );
};

export default Input;
