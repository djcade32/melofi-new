// Validate if a string is a valid email
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Wait for a specified time in milliseconds
export const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
