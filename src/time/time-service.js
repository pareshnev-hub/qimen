import { addDays } from "../calendar/week-calendar.js";
import { ANIMALS_RU, BRANCHES } from "../data/constants.js";

export const TIMEZONE_DATA_VERSION = "2026a-test";
export const PLACES = { sochi: { name: "Сочи", timezone: "Europe/Moscow", utcOffsetMinutes: 180, longitude: 39.72, latitude: 43.59 } };

function equationOfTimeMinutes(dateText) {
  const date = new Date(`${dateText}T12:00:00Z`);
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const day = Math.floor((date - start) / 86400000);
  const b = 2 * Math.PI * (day - 81) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

function shiftCivil(dateText, timeText, deltaMinutes) {
  const [hours, minutes] = timeText.split(":").map(Number);
  const date = new Date(`${dateText}T00:00:00Z`);
  date.setUTCMinutes(hours * 60 + minutes + deltaMinutes);
  return { date: date.toISOString().slice(0, 10), time: date.toISOString().slice(11, 16) };
}

export function resolveMoment({ date, time, placeId, useTrueSolarTime }) {
  const place = PLACES[placeId];
  if (!place) throw new Error("Неизвестное место.");
  const standardMeridian = place.utcOffsetMinutes / 4;
  const correction = useTrueSolarTime ? Math.round(4 * (place.longitude - standardMeridian) + equationOfTimeMinutes(date)) : 0;
  const adjusted = shiftCivil(date, time, correction);
  const hour = Number(adjusted.time.slice(0, 2));
  let branchIndex;
  let calculationDate = adjusted.date;
  if (hour >= 23 || hour < 1) {
    branchIndex = 0;
    if (hour >= 23) calculationDate = addDays(adjusted.date, 1);
  } else branchIndex = Math.floor((hour + 1) / 2);
  const start = branchIndex === 0 ? "23:00" : `${String(branchIndex * 2 - 1).padStart(2, "0")}:00`;
  const end = branchIndex === 0 ? "00:59" : `${String(branchIndex * 2).padStart(2, "0")}:59`;
  return { place, correction, adjustedDate: adjusted.date, adjustedTime: adjusted.time, calculationDate, branchIndex, hourLabel: `${start}–${end} · час ${ANIMALS_RU[branchIndex]} ${BRANCHES[branchIndex]}` };
}
