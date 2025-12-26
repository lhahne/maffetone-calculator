import { mkdir, copyFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const srcDir = new URL("./src/", import.meta.url);
const distDir = new URL("./dist/", import.meta.url);

await mkdir(distDir, { recursive: true });

const files = await readdir(srcDir);
const htmlFiles = files.filter(file => file.endsWith(".html"));

for (const file of htmlFiles) {
    await copyFile(new URL(file, srcDir), join(distDir.pathname, file));
    console.log(`Copied ${file} to dist/`);
}
