export const createLogger = (label: string) => {
  const isDev = process.env.NODE_ENV === "development";

  const defaultLogFuncs = {
    info: (...args: any[]) => console.log(`[${label}]`, ...args),
    error: (...args: any[]) => console.error(`[${label}]`, ...args),
    warn: (...args: any[]) => console.warn(`[${label}]`, ...args),
  };

  return {
    debug: {
      ...(isDev
        ? {
            ...defaultLogFuncs,
          }
        : {
            info: (...args: any[]) => {},
            error: (...args: any[]) => {},
            warn: (...args: any[]) => {},
          }),
    },
    ...defaultLogFuncs,
  };
};
