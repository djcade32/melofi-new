// Check if given character is a number
export const isNumber = (char: string) => {
  return !isNaN(Number(char));
};
