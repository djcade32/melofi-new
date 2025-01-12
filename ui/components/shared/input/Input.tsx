// import React, { DetailedHTMLProps, InputHTMLAttributes, useEffect, useState } from "react";
// import styles from "./input.module.css";
// import { BiSolidHide, BiSolidShow } from "@/imports/icons";
// import { Error } from "@/types/interfaces";

// interface InputProps
//   extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
//   prependIcon?: JSX.Element;
//   postpendIcon?: JSX.Element;
//   errorState?: Error[] | null;
// }

// const Input = ({ prependIcon, postpendIcon, errorState, ...props }: InputProps) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState<Error | undefined>(undefined);

//   const hasError = (): Error | undefined => {
//     return errorState?.find((error) => error.name === props.name);
//   };

//   useEffect(() => {
//     setError(hasError());
//   }, [errorState]);

//   const getPostpendIcon = () => {
//     if (props.type === "password") {
//       return (
//         <>
//           {showPassword ? (
//             <BiSolidShow
//               size={25}
//               color="var(--color-white)"
//               onClick={() => setShowPassword((prev) => !prev)}
//             />
//           ) : (
//             <BiSolidHide
//               size={25}
//               color="var(--color-white)"
//               onClick={() => setShowPassword((prev) => !prev)}
//             />
//           )}
//         </>
//       );
//     } else {
//       return <div className={styles.input__postpendIcon}>{postpendIcon}</div>;
//     }
//   };
//   return (
//     <div>
//       <div className={styles.input__container}>
//         <div>{prependIcon}</div>
//         <input
//           {...props}
//           style={{
//             ...props.style,
//             paddingLeft: prependIcon && "30px",
//             paddingRight: postpendIcon && "30px",
//             borderColor: error ? "var(--color-error)" : "var(--color-white)",
//           }}
//           type={showPassword ? "text" : props.type}
//         />
//         <div
//           className={styles.input__postpendIcon_container}
//           style={{
//             cursor: props.type === "password" ? "pointer" : "default",
//           }}
//         >
//           {getPostpendIcon()}
//         </div>
//       </div>
//       {error && error.message.trim().length > 0 && (
//         <p className={styles.input__error_text}>{error.message}</p>
//       )}
//     </div>
//   );
// };

// export default Input;

import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useState,
  forwardRef,
} from "react";
import styles from "./input.module.css";
import { BiSolidHide, BiSolidShow } from "@/imports/icons";
import { Error } from "@/types/general";

interface InputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  prependIcon?: JSX.Element;
  postpendIcon?: JSX.Element;
  errorState?: Error[] | null;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ prependIcon, postpendIcon, errorState, ...props }, ref) => {
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
                color="var(--color-white)"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            ) : (
              <BiSolidHide
                size={25}
                color="var(--color-white)"
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
            ref={ref}
            style={{
              ...props.style,
              paddingLeft: prependIcon && "30px",
              paddingRight: postpendIcon && "30px",
              borderColor: error ? "var(--color-error)" : "var(--color-white)",
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
        {error && error.message.trim().length > 0 && (
          <p className={styles.input__error_text}>{error.message}</p>
        )}
      </div>
    );
  }
);

export default Input;
