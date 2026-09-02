import { ganzhi, STEMS, BRANCHES } from "../data/constants.js";

export const TEST_RANGE = { start: "2026-08-31", end: "2026-09-06" };
const DAY_INDEX = { "2026-08-31": 13, "2026-09-01": 14, "2026-09-02": 15, "2026-09-03": 16, "2026-09-04": 17, "2026-09-05": 18, "2026-09-06": 19, "2026-09-07": 20 };

export function addDays(dateText, days) {
  const date = new Date(`${dateText}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getDayPillar(dateText) {
  const index = DAY_INDEX[dateText];
  if (index === undefined) throw new RangeError(`Расчётный день ${dateText} пока вне тестового календаря.`);
  return ganzhi(index);
}

export function getHourPillar(dayPillar, branchIndex) {
  const ziStemByDayStem = [0, 2, 4, 6, 8][dayPillar.index % 5];
  const stem = STEMS[(ziStemByDayStem + branchIndex) % 10];
  const branch = BRANCHES[branchIndex];
  const index = Array.from({ length: 60 }, (_, i) => ganzhi(i)).findIndex(item => item.stem === stem && item.branch === branch);
  return ganzhi(index);
}

export function getFourPillars(calculationDate, branchIndex) {
  const day = getDayPillar(calculationDate);
  return { year: { han: "丙午", ru: "Бин-У" }, month: { han: "丙申", ru: "Бин-Шэнь" }, day, hour: getHourPillar(day, branchIndex) };
}
