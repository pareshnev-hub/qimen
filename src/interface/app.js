import { calculateChart } from "../engine/qimen.js";
import { PALACE_ORDER, PALACES } from "../data/constants.js";

const $ = id => document.getElementById(id);

function renderPalace(number, data, focus) {
  const [name, direction] = PALACES[number];
  const tags = [];
  if (data.chief) tags.push('<span class="tag chief">值符 Чжи Фу</span>');
  if (data.chiefGate) tags.push('<span class="tag chief">值使 Чжи Ши</span>');
  if (focus.day === number) tags.push('<span class="tag day">День</span>');
  if (focus.hour === number) tags.push('<span class="tag hour">Час</span>');
  const classes = ["palace"];
  if (number === 5) classes.push("center");
  if (focus.day === number) classes.push("focus-day");
  if (focus.hour === number) classes.push("focus-hour");
  return `<article class="${classes.join(" ")}" data-number="${number}" aria-label="${name}-${number}">
    <div class="palace-head"><strong>${name}-${number}</strong><span>${direction}</span></div>
    <div class="palace-row"><span>Дух</span><strong>${data.deity}</strong></div>
    <div class="palace-row"><span>Врата</span><strong>${data.gate}</strong></div>
    <div class="palace-row"><span>Звезда</span><strong>${data.star}</strong></div>
    <div class="palace-row"><span>НТ / ЗТ</span><strong>${data.ht} / ${data.et}</strong></div>
    ${tags.length ? `<div class="palace-tags">${tags.join("")}</div>` : ""}
  </article>`;
}

function displayPillar(pillar) { return `${pillar.han} ${pillar.ru}`; }
function render(chart) {
  $("form-message").textContent = "";
  $("result").hidden = false;
  $("chart-heading").textContent = chart.title;
  $("chart-moment").textContent = chart.moment;
  $("dun-badge").innerHTML = `阴遁${chart.method.ju}局<small>Инь Дунь · ${chart.method.ju} цзюй · ${chart.method.name}</small>`;
  ["year", "month", "day", "hour"].forEach(name => $(`${name}-pillar`).textContent = displayPillar(chart.pillars[name]));
  $("season").textContent = chart.method.season;
  $("xunshou").textContent = `${chart.xunshou} → ${chart.hiddenJia}`;
  $("zhifu").textContent = `${chart.chiefStar} · дворец ${chart.chiefTarget}`;
  $("zhishi").textContent = `${chart.chiefGate} · дворец ${chart.chiefGateTarget}`;
  $("pattern").textContent = chart.pattern;
  $("focus-summary").textContent = `День ${chart.pillars.day.stem} → дворец ${chart.focus.day} · Час ${chart.pillars.hour.stem} → дворец ${chart.focus.hour}`;
  $("trace-list").innerHTML = chart.trace.map(step => `<li>${step}</li>`).join("");
  $("palace-grid").innerHTML = PALACE_ORDER.map(number => renderPalace(number, chart.palaces[number], chart.focus)).join("");
}

function inputValues() {
  return { date: $("date").value, time: $("time").value, placeId: $("place").value, methodId: $("method").value, useTrueSolarTime: $("solar-time").checked };
}
function recalculate(event) {
  event?.preventDefault();
  try { render(calculateChart(inputValues())); }
  catch (error) { $("result").hidden = true; $("form-message").textContent = error.message; }
}

$("chart-form").addEventListener("submit", recalculate);
$("solar-time").addEventListener("change", () => {
  $("solar-hint").textContent = $("solar-time").checked ? "Вкл. · применяется поправка долготы и уравнение времени" : "Выкл. · используется гражданское время";
  recalculate();
});
$("method").addEventListener("change", recalculate);
recalculate();
