import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

const enginePath = existsSync(new URL("../dist/src/engine/qimen.js", import.meta.url)) ? "../dist/src/engine/qimen.js" : "../src/engine/qimen.js";
const { calculateChart } = await import(enginePath);

const base = { date: "2026-09-02", placeId: "sochi", useTrueSolarTime: false, methodId: "chai-bu" };

test("контрольная карта часа Собаки — Инь 1, Фу Инь", () => {
  const chart = calculateChart({ ...base, time: "19:00" });
  assert.equal(chart.method.ju, 1);
  assert.equal(chart.pillars.hour.han, "甲戌");
  assert.equal(chart.chiefTarget, 9);
  assert.equal(chart.chiefGateTarget, 9);
  assert.equal(chart.pattern, "Фу Инь");
});

test("контрольная карта часа Свиньи совпадает по главным позициям", () => {
  const chart = calculateChart({ ...base, time: "21:00" });
  assert.equal(chart.pillars.hour.han, "乙亥");
  assert.equal(chart.chiefTarget, 2);
  assert.equal(chart.chiefGateTarget, 8);
  assert.equal(chart.focus.day, 2);
  assert.equal(chart.focus.hour, 7);
  assert.match(chart.palaces[7].star, /天芮.*天禽/);
  assert.equal(chart.chartNumber, 552);
});

test("час Кролика имеет устойчивый номер карты, пустоту и Лошадь", () => {
  const chart = calculateChart({ ...base, time: "05:00" });
  assert.equal(chart.pillars.hour.han, "丁卯");
  assert.equal(chart.moment.periodStart, "05:00");
  assert.equal(chart.moment.periodEnd, "07:00");
  assert.equal(chart.chartNumber, 544);
  assert.equal(chart.chartKey, "yin-1-03");
  assert.deepEqual(chart.voidBranches, ["戌", "亥"]);
  assert.deepEqual(chart.voidPalaces, [6]);
  assert.equal(chart.horseBranch, "巳");
  assert.equal(chart.horsePalace, 4);
});

test("Чай-Бу меняет нижнюю юань на верхнюю у Фу Тоу 己卯", () => {
  assert.equal(calculateChart({ ...base, date: "2026-09-01", time: "12:00" }).method.ju, 7);
  assert.equal(calculateChart({ ...base, date: "2026-09-02", time: "12:00" }).method.ju, 1);
});

test("Чжи Жунь рассчитывается отдельным методом", () => {
  const chart = calculateChart({ ...base, methodId: "zhi-run", time: "21:00" });
  assert.equal(chart.method.ju, 9);
  assert.equal(chart.method.id, "zhi-run");
});

test("весь час Крысы 23:00–01:00 использует один расчётный день", () => {
  const late = calculateChart({ ...base, date: "2026-09-01", time: "23:30" });
  const early = calculateChart({ ...base, date: "2026-09-02", time: "00:30" });
  assert.equal(late.moment.calculationDate, "2026-09-02");
  assert.equal(early.moment.calculationDate, "2026-09-02");
  assert.equal(late.pillars.hour.han, early.pillars.hour.han);
  assert.equal(late.pillars.hour.han, "甲子");
  assert.equal(late.moment.periodStart, "23:00");
  assert.equal(late.moment.periodEnd, "01:00");
});

test("дневной, месячный и годовой модули не подменяются часовой картой", () => {
  for (const chartType of ["day", "month", "year"]) {
    assert.throws(() => calculateChart({ ...base, time: "05:00", chartType }), /не прошёл проверку/);
  }
});
