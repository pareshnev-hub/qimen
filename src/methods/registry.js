import { calculateChaiBu } from "./chai-bu.js";
import { calculateZhiRun } from "./zhi-run.js";

export const METHODS = [
  { id: "chai-bu", label: "Чай-Бу 拆補法", enabled: true, calculate: calculateChaiBu },
  { id: "zhi-run", label: "Чжи Жунь 置闰法", enabled: true, calculate: calculateZhiRun },
  { id: "method-3", label: "Метод 3", enabled: false },
  { id: "method-4", label: "Метод 4", enabled: false },
  { id: "method-5", label: "Метод 5", enabled: false }
];

export function getMethod(id) {
  const method = METHODS.find(item => item.id === id && item.enabled);
  if (!method) throw new Error("Этот метод пока не подключён.");
  return method;
}
