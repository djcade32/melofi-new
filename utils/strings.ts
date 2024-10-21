export function toSnakeCase(str: string): string {
  return str
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim() // Trim leading and trailing spaces
    .toLowerCase() // Convert entire string to lowercase
    .replace(/[^a-z0-9]+/g, "_"); // Replace non-alphanumeric characters with underscores
}
