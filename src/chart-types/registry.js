import { hourChart } from "./hour.js";
import { dayChart } from "./day.js";
import { monthChart } from "./month.js";
import { yearChart } from "./year.js";

export const CHART_TYPES = [hourChart, dayChart, monthChart, yearChart];

export function getChartType(id) {
  return CHART_TYPES.find(item => item.id === id) || hourChart;
}
