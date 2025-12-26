import { mkdir, copyFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const srcDir = new URL("./src/", import.meta.url);
const distDir = new URL("./dist/", import.meta.url);

await mkdir(distDir, { recursive: true });

const files = await readdir(srcDir);

// Handle HTML files
const htmlFiles = files.filter(file => file.endsWith(".html"));
for (const file of htmlFiles) {
    await copyFile(new URL(file, srcDir), join(distDir.pathname, file));
    console.log(`Copied ${file} to dist/`);
}

// Handle JS files - automatically find *-main.js and main.js
const entryPoints = files
    .filter(file => file.endsWith("-main.js") || file === "main.js")
    .map(file => join(srcDir.pathname, file));

console.log("Building JS entry points:", entryPoints);

const result = await Bun.build({
    entrypoints: entryPoints,
    outdir: "./dist",
    minify: process.argv.includes("--minify"),
});

if (!result.success) {
    console.error("Build failed");
    for (const message of result.logs) {
        console.error(message);
    }
    process.exit(1);
}

console.log("Build successful");
