export const dateInPast = (time: string) => {
  const currentDate = new Date();
  const endTime = new Date(time);

  // Rebuilding date for possibility of getting a date in the past
  // because it is a recurring event
  return convertISOToISOLocal(currentDate) > convertISOToISOLocal(endTime);
};

export const convertISOToISOLocal = (t: any) => {
  let z = t.getTimezoneOffset() * 60 * 1000;
  let tlocal = t - z;
  tlocal = new Date(tlocal);
  let iso = tlocal.toISOString();
  iso = iso.split(".")[0];

  return iso + "Z";
};

export const convertISOTimestamp = (timestamp: string) => {
  const isoDate = new Date(timestamp);
  const convertedDate = isoDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return convertedDate[0] === "0" ? convertedDate.slice(1) : convertedDate;
};
