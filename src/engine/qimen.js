import { getFourPillars, TEST_RANGE } from "../calendar/week-calendar.js";
import { buildPlate } from "./plate.js";
import { getMethod } from "../methods/registry.js";
import { resolveMoment } from "../time/time-service.js";
import { getChartType } from "../chart-types/registry.js";

function displayPillar(pillar) { return `${pillar.han} ${pillar.ru}`; }
function formatDate(dateText) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${dateText}T12:00:00Z`));
}

export function calculateChart(input) {
  const chartType = getChartType(input.chartType || "hour");
  if (!chartType.enabled) throw new Error(`Модуль «${chartType.id}» подготовлен, но его алгоритм ещё не прошёл проверку.`);
  if (input.date < TEST_RANGE.start || input.date > TEST_RANGE.end) throw new RangeError(`В тестовой версии доступны даты ${TEST_RANGE.start} — ${TEST_RANGE.end}.`);
  const moment = resolveMoment(input);
  const pillars = getFourPillars(moment.calculationDate, moment.branchIndex);
  const method = getMethod(input.methodId);
  const methodResult = method.calculate({ pillars, moment });
  const plate = buildPlate({ dun: methodResult.dun, ju: methodResult.ju, pillars });
  const timeNote = moment.correction ? `истинное солнечное ${moment.adjustedTime} (${moment.correction > 0 ? "+" : ""}${moment.correction} мин)` : "гражданское время";
  const dayShift = moment.calculationDate !== input.date ? ` · расчётный день ${formatDate(moment.calculationDate)}` : "";
  return {
    ...plate, method: methodResult, chartType,
    title: `${moment.hourLabel} · ${displayPillar(pillars.hour)}`,
    moment: `${moment.place.name} · ${formatDate(input.date)} · ${timeNote}${dayShift}`,
    pillars, moment,
    trace: [
      `Время: <strong>${moment.hourLabel}</strong>${dayShift}.`,
      `Четыре столпа: <strong>${pillars.year.han} / ${pillars.month.han} / ${pillars.day.han} / ${pillars.hour.han}</strong>.`,
      ...methodResult.trace,
      `旬首 часа: <strong>${plate.xunshou}</strong>, скрытый 甲 = <strong>${plate.hiddenJia}</strong>.`,
      `Чжи Фу приходит в <strong>дворец ${plate.chiefTarget}</strong>, Чжи Ши — в <strong>дворец ${plate.chiefGateTarget}</strong>.`
    ]
  };
}
