export const dateInPast = (time: string) => {
  const currentDate = new Date();
  const endTime = new Date(time);

  // Rebuilding date for possibility of getting a date in the past
  // because it is a recurring event
  return convertISOToISOLocal(currentDate) > convertISOToISOLocal(endTime);
};

export const convertISOToISOLocal = (t: Date) => {
  if (!(t instanceof Date)) {
    throw new Error("Expected a Date object");
  }
  const localISO = t.toISOString().slice(0, -1); // Removes the "Z"
  const offsetInMs = t.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(t.getTime() - offsetInMs);

  return localDate.toISOString().split(".")[0]; // Formats as local ISO without milliseconds
};

export const convertISOTimestamp = (timestamp: string) => {
  const isoDate = new Date(timestamp);
  const convertedDate = isoDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return convertedDate[0] === "0" ? convertedDate.slice(1) : convertedDate;
};

export const isNewDay = (date: Date) => {
  const currentDate = new Date();
  return date.getDate() !== currentDate.getDate();
};
