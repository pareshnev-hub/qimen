import { ru } from "./locales/ru.js";
import { en } from "./locales/en.js";

export const LOCALES = { ru, en };
export const AVAILABLE_LOCALES = Object.values(LOCALES).map(({ id, label }) => ({ id, label }));

export function getLocale(id) {
  return LOCALES[id] || ru;
}

export function registerLocale(locale) {
  if (!locale?.id) throw new Error("Locale id is required");
  LOCALES[locale.id] = locale;
}
