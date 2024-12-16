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
