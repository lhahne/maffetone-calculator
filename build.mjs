import { mkdir, copyFile } from "node:fs/promises";
import { join } from "node:path";

const distDir = new URL("./dist/", import.meta.url);
await mkdir(distDir, { recursive: true });

await copyFile(new URL("./src/index.html", import.meta.url), join(distDir.pathname, "index.html"));
await copyFile(new URL("./src/pace.html", import.meta.url), join(distDir.pathname, "pace.html"));
