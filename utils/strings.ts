import { Node } from "slate";

// Convert string to snake_case
export function toSnakeCase(str: string): string {
  return str
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim() // Trim leading and trailing spaces
    .toLowerCase() // Convert entire string to lowercase
    .replace(/[^a-z0-9]+/g, "_"); // Replace non-alphanumeric characters with underscores
}

// Convert Descedant[] to plain text
export const serializeToPlainText = (nodes: Node[]): string => {
  return nodes.map((n) => Node.string(n)).join("\n");
};

// Upper case the first letter of a string
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
