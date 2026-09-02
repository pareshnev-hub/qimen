import { calculateChart } from "../engine/qimen.js";
import { PALACE_ORDER } from "../data/constants.js";
import { CHART_TYPES } from "../chart-types/registry.js";
import { AVAILABLE_LOCALES, getLocale } from "../i18n/index.js";

const $ = id => document.getElementById(id);
const TEST_START = "2026-08-31";
const TEST_END = "2026-09-06";
const ENGINE_VERSION = "qimen-engine 0.4 · calendar 2026-test · timezone 2026a-test";
const flippedPalaces = new Set();
let currentChart = null;
let locale = getLocale("ru");

const PALACE_ELEMENTS = { 1:"water",2:"earth",3:"wood",4:"wood",5:"earth",6:"metal",7:"metal",8:"earth",9:"fire" };
const STEM_INFO = {
  甲:["wood","yang"],乙:["wood","yin"],丙:["fire","yang"],丁:["fire","yin"],戊:["earth","yang"],
  己:["earth","yin"],庚:["metal","yang"],辛:["metal","yin"],壬:["water","yang"],癸:["water","yin"]
};
const BRANCH_INFO = {
  子:["water","yang"],丑:["earth","yin"],寅:["wood","yang"],卯:["wood","yin"],辰:["earth","yang"],巳:["fire","yin"],
  午:["fire","yang"],未:["earth","yin"],申:["metal","yang"],酉:["metal","yin"],戌:["earth","yang"],亥:["water","yin"]
};
const DEITY_GLYPHS = [
  ["值符","符","earth"],["螣蛇","蛇","fire"],["太阴","陰","metal"],["六合","合","wood"],
  ["白虎","虎","metal"],["玄武","武","water"],["九地","地","earth"],["九天","天","metal"]
];
const GATE_GLYPHS = [
  ["休","休","water"],["死","死","earth"],["伤","傷","wood"],["杜","杜","wood"],
  ["开","開","metal"],["惊","驚","metal"],["生","生","earth"],["景","景","fire"]
];
const STAR_GLYPHS = [
  ["天蓬","蓬","water"],["天芮","芮","earth"],["天冲","沖","wood"],["天辅","輔","wood"],
  ["天禽","禽","earth"],["天心","心","metal"],["天柱","柱","metal"],["天任","任","earth"],["天英","英","fire"]
];

function domainMatches(value, dictionary) {
  return Object.keys(dictionary).filter(key => value.includes(key));
}

function glyphData(value, dictionary, glyphDictionary) {
  const keys = domainMatches(value, dictionary);
  const items = glyphDictionary.filter(([key]) => keys.includes(key));
  return {
    items: items.map(([,han]) => han),
    className: items[0]?.[2] || "earth",
    label: keys.map(key => dictionary[key]).join(" / ")
  };
}

function stemData(value) {
  const items = [...value].filter(char => STEM_INFO[char]);
  return {
    items,
    className: items.length === 1 ? STEM_INFO[items[0]][0] : "water",
    label: items.map(char => locale.stems[char]).join(" / ")
  };
}

function glyphMarkup(items) {
  return `<span class="symbol-pair">${items.map(item => `<i>${item}</i>`).join("")}</span>`;
}

function symbolBlock(kind, value, dictionary, glyphDictionary, emphasis = "") {
  const data = dictionary ? glyphData(value, dictionary, glyphDictionary) : stemData(value);
  return `<span class="symbol ${kind} ${emphasis}"><b class="${data.className}">${glyphMarkup(data.items)}</b><small>${data.label}</small></span>`;
}

function localizedValue(value, dictionary) {
  const keys = domainMatches(value, dictionary);
  if (keys.length) return keys.map(key => `${key} ${dictionary[key]}`).join(" + ");
  const stems = [...value].filter(char => STEM_INFO[char]);
  return stems.length ? stems.map(char => `${char} ${locale.stems[char]}`).join(" + ") : "—";
}

function renderFront(number, data, chart) {
  if (number === 5) {
    return `<span class="center-front">
      <span class="chart-number-label">${locale.ui.chartNumber} №${chart.chartNumber}</span>
      <b>${locale.polarity.yin} ${chart.method.ju}</b>
      <span>${locale.methods[chart.method.id]} · ${chart.method.han}</span>
      <span>${locale.chartTypes.hour}</span>
      <em class="center-stem ${STEM_INFO[data.et[0]]?.[0] || "earth"}">${data.et[0]}</em>
    </span><span class="palace-name">${locale.palaces[5][0]} 5</span>`;
  }
  const focusFlags = [
    chart.focus.day === number ? `<i class="mini-flag day">${locale.id === "ru" ? "Д" : "D"}</i>` : "",
    chart.focus.hour === number ? `<i class="mini-flag hour">${locale.id === "ru" ? "Ч" : "H"}</i>` : ""
  ].join("");
  const horse = chart.horsePalace === number ? '<i class="horse-mark" aria-label="Travel Horse">♞</i>' : "";
  return `
    ${symbolBlock("deity", data.deity, locale.deities, DEITY_GLYPHS, data.chief ? "is-chief" : "")}
    ${symbolBlock("gate", data.gate, locale.gates, GATE_GLYPHS, data.chiefGate ? "is-chief-gate" : "")}
    ${symbolBlock("heaven", data.ht)}
    ${symbolBlock("star", data.star, locale.stars, STAR_GLYPHS)}
    ${symbolBlock("earth-stem", data.et)}
    ${horse}
    <span class="palace-name">${locale.palaces[number][0]} ${number}</span>
    <span class="palace-flags">${focusFlags}</span>`;
}

function renderBack(number, data, chart) {
  const [name, direction] = locale.palaces[number];
  const states = [];
  if (chart.voidPalaces.includes(number)) states.push(locale.ui.void);
  if (chart.horsePalace === number) states.push(`${locale.ui.horse} ${chart.horseBranch}`);
  if (data.chief) states.push("值符 " + locale.deities["值符"]);
  if (data.chiefGate) states.push("值使");
  return `
    <span class="back-head"><strong>${name} ${number}</strong><span>${direction} · ${locale.elements[PALACE_ELEMENTS[number]]}</span></span>
    <span class="back-list">
      <span class="back-row"><span>神</span><b>${localizedValue(data.deity, locale.deities)}</b></span>
      <span class="back-row"><span>門</span><b>${localizedValue(data.gate, locale.gates)}</b></span>
      <span class="back-row"><span>星</span><b>${localizedValue(data.star, locale.stars)}</b></span>
      <span class="back-row"><span>天盤</span><b>${localizedValue(data.ht, locale.stems)}</b></span>
      <span class="back-row"><span>地盤</span><b>${localizedValue(data.et, locale.stems)}</b></span>
    </span>
    <span class="state-line"><b>${locale.ui.states}:</b> ${states.join(" · ") || locale.ui.noStates}</span>
    <span class="future-slot">${locale.ui.futureAnalysis}</span>`;
}

function renderPalace(number, data, chart, order) {
  const classes = ["palace-card"];
  if (number === 5) classes.push("center");
  if (chart.focus.day === number) classes.push("focus-day");
  if (chart.focus.hour === number) classes.push("focus-hour");
  if (chart.voidPalaces.includes(number)) classes.push("is-void");
  if (flippedPalaces.has(number)) classes.push("is-flipped");
  return `<button class="${classes.join(" ")}" type="button" data-palace="${number}" style="--flip-order:${order}" aria-pressed="${flippedPalaces.has(number)}">
    <span class="palace-inner">
      <span class="palace-face palace-front">${renderFront(number, data, chart)}</span>
      <span class="palace-face palace-back">${renderBack(number, data, chart)}</span>
    </span>
  </button>`;
}

function renderPillars(chart) {
  const order = ["hour", "day", "month", "year"];
  $("pillar-board").innerHTML = order.map(name => {
    const pillar = chart.pillars[name];
    const stem = pillar.stem || pillar.han[0];
    const branch = pillar.branch || pillar.han[1];
    const [stemElement, polarity] = STEM_INFO[stem];
    const [branchElement] = BRANCH_INFO[branch];
    const disabled = name === "month" || name === "year";
    return `<article class="pillar ${name === "hour" ? "is-hour" : ""}">
      <div class="pillar-nav">
        <button type="button" data-shift="${name}" data-direction="-1" ${disabled ? "disabled" : ""} aria-label="${locale.ui.previous} ${locale.pillars[name]}">‹</button>
        <button type="button" data-shift="${name}" data-direction="1" ${disabled ? "disabled" : ""} aria-label="${locale.ui.next} ${locale.pillars[name]}">›</button>
      </div>
      <div class="pillar-title">${locale.pillars[name]}</div>
      <div class="pillar-element">${locale.elements[stemElement]} · ${locale.polarity[polarity]}</div>
      <div class="pillar-symbol ${stemElement}">${stem}</div>
      <div class="pillar-symbol ${branchElement}">${branch}</div>
      <div class="pillar-animal">${locale.elements[branchElement]} · ${locale.animals[branch]}</div>
    </article>`;
  }).join("");
}

function renderChartTypes() {
  $("chart-type-switch").innerHTML = CHART_TYPES.map(type => `<button class="segment ${type.id === "hour" ? "is-active" : ""}" type="button" data-chart-type="${type.id}" ${type.enabled ? "" : "disabled"} title="${type.enabled ? "" : locale.ui.futureModule}">${locale.chartTypes[type.id]}</button>`).join("");
}

function formatDate(dateText) {
  return new Intl.DateTimeFormat(locale.id === "ru" ? "ru-RU" : "en-GB", { day:"numeric", month:"long", year:"numeric", timeZone:"UTC" }).format(new Date(`${dateText}T12:00:00Z`));
}

function renderCalculationTime(chart) {
  const stem = chart.pillars.hour.stem;
  const branch = chart.pillars.hour.branch;
  const branchElement = BRANCH_INFO[branch][0];
  const stemElement = STEM_INFO[stem][0];
  $("chart-heading").innerHTML = `
    <span>${chart.moment.periodStart}–${chart.moment.periodEnd}</span>
    <span class="${branchElement}">${locale.pillars.hour} ${locale.animals[branch]} · ${branch}</span>
    <span><i class="${stemElement}">${stem} ${locale.stems[stem]}</i><i class="${branchElement}">${branch} ${locale.branches[branch]}</i></span>`;
  const correction = chart.moment.correction ? ` · ${locale.ui.solarTime}: ${chart.moment.adjustedTime} (${chart.moment.correction > 0 ? "+" : ""}${chart.moment.correction} min)` : "";
  const shifted = chart.moment.calculationDate !== $("date").value ? ` · ${locale.pillars.day}: ${formatDate(chart.moment.calculationDate)}` : "";
  $("chart-moment").textContent = `${chart.moment.place.name} · ${formatDate($("date").value)}${correction}${shifted}`;
}

function renderTrace(chart) {
  const pillars = ["year","month","day","hour"].map(name => chart.pillars[name].han).join(" / ");
  const lines = locale.id === "ru" ? [
    `Двухчасовка: <strong>${chart.moment.periodStart}–${chart.moment.periodEnd}</strong>.`,
    `Четыре столпа: <strong>${pillars}</strong>.`,
    `Метод: <strong>${locale.methods[chart.method.id]}</strong>; Инь ${chart.method.ju}.`,
    `旬首: <strong>${chart.xunshou}</strong>; скрытый 甲 = <strong>${chart.hiddenJia}</strong>.`,
    `Чжи Фу — дворец <strong>${chart.chiefTarget}</strong>; Чжи Ши — дворец <strong>${chart.chiefGateTarget}</strong>.`,
    `Пустота: <strong>${chart.voidBranches.join(" ")}</strong>; Лошадь: <strong>${chart.horseBranch}</strong>.`
  ] : [
    `Double hour: <strong>${chart.moment.periodStart}–${chart.moment.periodEnd}</strong>.`,
    `Four Pillars: <strong>${pillars}</strong>.`,
    `Method: <strong>${locale.methods[chart.method.id]}</strong>; Yin ${chart.method.ju}.`,
    `Xun Shou: <strong>${chart.xunshou}</strong>; hidden Jia = <strong>${chart.hiddenJia}</strong>.`,
    `Chief Star — palace <strong>${chart.chiefTarget}</strong>; Chief Door — palace <strong>${chart.chiefGateTarget}</strong>.`,
    `Void: <strong>${chart.voidBranches.join(" ")}</strong>; Travel Horse: <strong>${chart.horseBranch}</strong>.`
  ];
  $("trace-list").innerHTML = lines.map(line => `<li>${line}</li>`).join("");
}

function seasonName(chart) {
  return chart.method.season.includes("白露") ? locale.seasons.bailu : locale.seasons.chushu;
}

function patternName(pattern) {
  if (locale.id === "ru") return pattern;
  return pattern === "Фу Инь" ? "Fu Yin" : pattern === "Фань Инь" ? "Fan Yin" : "Regular rotation";
}

function updateFlipButton() {
  const allFlipped = flippedPalaces.size === PALACE_ORDER.length;
  $("flip-all").setAttribute("aria-pressed", String(allFlipped));
  $("flip-all").querySelector(".flip-label").textContent = allFlipped ? locale.ui.returnChart : locale.ui.decode;
}

function render(chart, { resetFlip = true } = {}) {
  currentChart = chart;
  if (resetFlip) flippedPalaces.clear();
  $("form-message").textContent = "";
  $("result").hidden = false;
  renderCalculationTime(chart);
  $("dun-badge").textContent = `陰遁${chart.method.ju}局 · ${locale.polarity.yin} ${chart.method.ju} · ${locale.methods[chart.method.id]}`;
  $("season").textContent = seasonName(chart);
  $("xunshou").textContent = `${chart.xunshou} → ${chart.hiddenJia}`;
  $("zhifu").textContent = `${localizedValue(chart.chiefStar, locale.stars)} · ${locale.palaces[chart.chiefTarget][0]} ${chart.chiefTarget}`;
  $("zhishi").textContent = `${localizedValue(chart.chiefGate, locale.gates)} · ${locale.palaces[chart.chiefGateTarget][0]} ${chart.chiefGateTarget}`;
  $("pattern").textContent = patternName(chart.pattern);
  $("chart-number").textContent = `№${chart.chartNumber} · ${chart.chartKey}`;
  $("focus-summary").textContent = `${locale.pillars.day} ${chart.pillars.day.stem} → ${locale.palaces[chart.focus.day][0]} ${chart.focus.day}; ${locale.pillars.hour} ${chart.pillars.hour.stem} → ${locale.palaces[chart.focus.hour][0]} ${chart.focus.hour}`;
  renderTrace(chart);
  renderPillars(chart);
  $("palace-grid").innerHTML = PALACE_ORDER.map((number, index) => renderPalace(number, chart.palaces[number], chart, index)).join("");
  $("engine-version").textContent = ENGINE_VERSION;
  updateFlipButton();
  updateUrl();
}

function applyLocale() {
  document.documentElement.lang = locale.id;
  document.querySelectorAll("[data-i18n]").forEach(node => {
    const value = locale.ui[node.dataset.i18n];
    if (value) node.textContent = value;
  });
  document.querySelectorAll("[data-direction]").forEach(node => { node.textContent = locale.directions[node.dataset.direction]; });
  $("place").options[0].textContent = locale.id === "ru" ? "Сочи · UTC+3" : "Sochi · UTC+3";
  [...$("method").options].forEach(option => { option.textContent = `${locale.methods[option.value]} ${option.value === "chai-bu" ? "拆補法" : "置闰法"}`; });
  $("solar-hint").textContent = $("solar-time").checked ? locale.ui.enabled : locale.ui.disabled;
  const themeAction = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  $("theme-toggle").querySelector("b").textContent = locale.ui[themeAction];
  $("theme-toggle").setAttribute("aria-label", `${locale.ui.theme}: ${locale.ui[themeAction]}`);
  renderChartTypes();
  if (currentChart) render(currentChart, { resetFlip: false });
  else updateUrl();
}

function inputValues() {
  return { date:$("date").value, time:$("time").value, placeId:$("place").value, methodId:$("method").value, chartType:"hour", useTrueSolarTime:$("solar-time").checked };
}

function recalculate(event) {
  event?.preventDefault();
  try { render(calculateChart(inputValues())); }
  catch (error) { currentChart = null; $("result").hidden = true; $("form-message").textContent = error.message; }
}

function shiftDateTime(kind, direction) {
  const [hours, minutes] = $("time").value.split(":").map(Number);
  const date = new Date(`${$("date").value}T00:00:00Z`);
  if (kind === "hour") date.setUTCMinutes(hours * 60 + minutes + direction * 120);
  else if (kind === "day") { date.setUTCMinutes(hours * 60 + minutes); date.setUTCDate(date.getUTCDate() + direction); }
  const nextDate = date.toISOString().slice(0,10);
  if (nextDate < TEST_START || nextDate > TEST_END) {
    $("form-message").textContent = locale.id === "ru" ? "Достигнута граница тестовой недели." : "The test-week boundary has been reached.";
    return;
  }
  $("date").value = nextDate;
  $("time").value = date.toISOString().slice(11,16);
  recalculate();
}

function updateUrl() {
  const query = new URLSearchParams({
    date:$("date").value, time:$("time").value, city:$("place").value, method:$("method").value,
    chart:"hour", lang:locale.id, theme:document.documentElement.dataset.theme
  });
  if ($("solar-time").checked) query.set("solar","1");
  history.replaceState(null, "", `${location.pathname}?${query}`);
}

function restoreState() {
  const query = new URLSearchParams(location.search);
  if (query.get("date") >= TEST_START && query.get("date") <= TEST_END) $("date").value = query.get("date");
  if (/^\d{2}:\d{2}$/.test(query.get("time") || "")) $("time").value = query.get("time");
  if (["chai-bu","zhi-run"].includes(query.get("method"))) $("method").value = query.get("method");
  $("solar-time").checked = query.get("solar") === "1";
  const savedLocale = query.get("lang") || localStorage.getItem("qimen-locale") || "ru";
  locale = getLocale(savedLocale);
  const savedTheme = query.get("theme") || localStorage.getItem("qimen-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.dataset.theme = ["light","dark"].includes(savedTheme) ? savedTheme : "light";
  document.documentElement.dataset.symbolSize = localStorage.getItem("qimen-symbol-size") || "standard";
}

function initializeControls() {
  $("language").innerHTML = AVAILABLE_LOCALES.map(item => `<option value="${item.id}">${item.label}</option>`).join("");
  $("language").value = locale.id;
  $("symbol-size").value = document.documentElement.dataset.symbolSize;
  applyLocale();
}

$("palace-grid").addEventListener("click", event => {
  const card = event.target.closest(".palace-card");
  if (!card || !currentChart) return;
  const number = Number(card.dataset.palace);
  flippedPalaces.has(number) ? flippedPalaces.delete(number) : flippedPalaces.add(number);
  card.classList.toggle("is-flipped");
  card.setAttribute("aria-pressed", String(flippedPalaces.has(number)));
  updateFlipButton();
});

$("flip-all").addEventListener("click", () => {
  const flipToBack = flippedPalaces.size !== PALACE_ORDER.length;
  flippedPalaces.clear();
  if (flipToBack) PALACE_ORDER.forEach(number => flippedPalaces.add(number));
  document.querySelectorAll(".palace-card").forEach(card => {
    const flipped = flippedPalaces.has(Number(card.dataset.palace));
    card.classList.toggle("is-flipped", flipped);
    card.setAttribute("aria-pressed", String(flipped));
  });
  updateFlipButton();
});

$("pillar-board").addEventListener("click", event => {
  const button = event.target.closest("[data-shift]");
  if (button && !button.disabled) shiftDateTime(button.dataset.shift, Number(button.dataset.direction));
});

$("theme-toggle").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("qimen-theme", next);
  $("theme-toggle").querySelector("b").textContent = locale.ui[next === "dark" ? "light" : "dark"];
  updateUrl();
});

$("language").addEventListener("change", event => {
  locale = getLocale(event.target.value);
  localStorage.setItem("qimen-locale", locale.id);
  applyLocale();
});

$("symbol-size").addEventListener("change", event => {
  document.documentElement.dataset.symbolSize = event.target.value;
  localStorage.setItem("qimen-symbol-size", event.target.value);
});

$("legend-toggle").addEventListener("click", () => { $("legend-panel").hidden = !$("legend-panel").hidden; });
$("fullscreen-button").addEventListener("click", () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else $("chart-panel").requestFullscreen?.();
});
document.addEventListener("fullscreenchange", () => {
  $("fullscreen-button").querySelector("span:last-child").textContent = document.fullscreenElement ? locale.ui.exitFullscreen : locale.ui.fullscreen;
});

$("chart-form").addEventListener("submit", recalculate);
$("solar-time").addEventListener("change", () => { $("solar-hint").textContent = $("solar-time").checked ? locale.ui.enabled : locale.ui.disabled; recalculate(); });
$("method").addEventListener("change", recalculate);

restoreState();
initializeControls();
recalculate();
