// Convert given mins to hr and mins
export const convertMinsToHrAndMins = (mins: number) => {
  const hr = Math.floor(mins / 60);
  const min = mins % 60;
  return { hr, min };
};

// Convert given mins to hr
export const convertMinsToHr = (mins: number) => {
  return Math.floor(mins / 60);
};

// Convert given mins to hr, mins and sec
export const convertMinsToHrMinsSec = (mins: number) => {
  const hr = Math.floor(mins / 60); // Calculate hours
  const min = Math.floor(mins % 60); // Remaining minutes
  const sec = Math.round((mins % 1) * 60); // Convert fractional minutes to seconds
  return { hr, min, sec };
};

// Convert given mins to secs
export const convertMinsToSecs = (mins: number) => {
  return mins * 60;
};

// Convert seconds to hr, mins and sec
export const convertSecsToHrMinsSec = (secs: number) => {
  const hr = Math.floor(secs / 3600); // Calculate hours
  const min = Math.floor((secs % 3600) / 60); // Remaining minutes
  const sec = secs % 60; // Remaining seconds
  return { hr, min, sec };
};

// Convert seconds to mins
export const convertSecsToMins = (secs: number) => {
  return secs / 60;
};

// Add given seconds to current time
export const addSecondsToCurrentTime = (secs: number) => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + secs);
  return date.toISOString();
};
