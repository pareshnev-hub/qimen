import { readFile, access } from "node:fs/promises";

const required = ["index.html", "styles.css", "app.js"];
for (const file of required) await access(file);

const html = await readFile("index.html", "utf8");
const app = await readFile("app.js", "utf8");

if (!html.includes("Калькулятор Ци Мэнь")) throw new Error("Site title is missing");
if (!app.includes("2026-09-02T21")) throw new Error("Reference chart is missing");

console.log("Static site validation passed");
