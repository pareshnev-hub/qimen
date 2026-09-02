import { access, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const root = existsSync("dist/index.html") ? "dist/" : "";
const required = [
  `${root}index.html`, `${root}styles.css`, `${root}src/interface/app.js`, `${root}src/engine/qimen.js`,
  `${root}src/engine/plate.js`, `${root}src/methods/chai-bu.js`, `${root}src/methods/zhi-run.js`
];
for (const file of required) await access(file);
const html = await readFile(`${root}index.html`, "utf8");
if (!html.includes('type="module"')) throw new Error("Module entrypoint is missing");
if (!html.includes("Чжи Жунь")) throw new Error("Zhi Run selector is missing");
console.log("Static site validation passed");
