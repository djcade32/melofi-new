import { execSync } from "child_process";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Needed because __dirname doesn't exist in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get version
const packageJsonPath = path.join(__dirname, "../package.json");
const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
const version = packageJson.version;

const filename = `Melofi-${version}.dmg`;
const filepath = path.join(__dirname, `../dist/${filename}`);

console.log(`Uploading ${filename} to R2...`);

execSync(`rclone copy ${filepath} melofi-r2:melofi-installs/mac`, {
  stdio: "inherit",
});

console.log("Upload complete.");
