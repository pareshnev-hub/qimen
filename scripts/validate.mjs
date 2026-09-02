import { access, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const root = existsSync("dist/index.html") ? "dist/" : "";
const required = [
  `${root}index.html`, `${root}styles.css`, `${root}src/interface/app.js`, `${root}src/engine/qimen.js`,
  `${root}src/engine/plate.js`, `${root}src/methods/chai-bu.js`, `${root}src/methods/zhi-run.js`,
  `${root}src/chart-types/registry.js`, `${root}src/chart-types/hour.js`, `${root}src/chart-types/day.js`,
  `${root}src/chart-types/month.js`, `${root}src/chart-types/year.js`, `${root}src/i18n/index.js`,
  `${root}src/i18n/locales/ru.js`, `${root}src/i18n/locales/en.js`
];
for (const file of required) await access(file);
const html = await readFile(`${root}index.html`, "utf8");
if (!html.includes('type="module"')) throw new Error("Module entrypoint is missing");
if (!html.includes("Чжи Жунь")) throw new Error("Zhi Run selector is missing");
if (!html.includes('id="flip-all"')) throw new Error("Palace flip control is missing");
if (!html.includes('id="chart-type-switch"')) throw new Error("Chart type switch is missing");
if (!html.includes('id="theme-toggle"')) throw new Error("Theme control is missing");
if (!html.includes('id="language"')) throw new Error("Language control is missing");
if (!html.includes('id="fullscreen-button"')) throw new Error("Fullscreen control is missing");
console.log("Static site validation passed");
