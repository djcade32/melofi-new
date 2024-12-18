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
