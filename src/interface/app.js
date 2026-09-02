import { calculateChart } from "../engine/qimen.js";
import { PALACE_ORDER, PALACES } from "../data/constants.js";

const $ = id => document.getElementById(id);
const flippedPalaces = new Set();
let currentChart = null;

const PALACE_ELEMENTS = {
  1: ["Вода", "water"], 2: ["Земля", "earth"], 3: ["Дерево", "wood"],
  4: ["Дерево", "wood"], 5: ["Земля", "earth"], 6: ["Металл", "metal"],
  7: ["Металл", "metal"], 8: ["Земля", "earth"], 9: ["Огонь", "fire"]
};
const STEM_INFO = {
  甲: ["Дерево Ян", "wood"], 乙: ["Дерево Инь", "wood"], 丙: ["Огонь Ян", "fire"], 丁: ["Огонь Инь", "fire"],
  戊: ["Земля Ян", "earth"], 己: ["Земля Инь", "earth"], 庚: ["Металл Ян", "metal"], 辛: ["Металл Инь", "metal"],
  壬: ["Вода Ян", "water"], 癸: ["Вода Инь", "water"]
};
const BRANCH_INFO = {
  子: ["Вода Ян · Крыса", "water"], 丑: ["Земля Инь · Бык", "earth"], 寅: ["Дерево Ян · Тигр", "wood"],
  卯: ["Дерево Инь · Кролик", "wood"], 辰: ["Земля Ян · Дракон", "earth"], 巳: ["Огонь Инь · Змея", "fire"],
  午: ["Огонь Ян · Лошадь", "fire"], 未: ["Земля Инь · Коза", "earth"], 申: ["Металл Ян · Обезьяна", "metal"],
  酉: ["Металл Инь · Петух", "metal"], 戌: ["Земля Ян · Собака", "earth"], 亥: ["Вода Инь · Свинья", "water"]
};
const DEITY_GLYPHS = [
  ["值符", "符", "earth"], ["螣蛇", "蛇", "fire"], ["太阴", "陰", "metal"], ["六合", "合", "wood"],
  ["白虎", "虎", "metal"], ["玄武", "武", "water"], ["九地", "地", "earth"], ["九天", "天", "metal"]
];
const GATE_GLYPHS = [
  ["休", "休", "water"], ["死", "死", "earth"], ["伤", "傷", "wood"], ["杜", "杜", "wood"],
  ["开", "開", "metal"], ["惊", "驚", "metal"], ["生", "生", "earth"], ["景", "景", "fire"]
];
const STAR_GLYPHS = [
  ["天蓬", "蓬", "water"], ["天芮", "芮", "earth"], ["天冲", "沖", "wood"], ["天辅", "輔", "wood"],
  ["天禽", "禽", "earth"], ["天心", "心", "metal"], ["天柱", "柱", "metal"], ["天任", "任", "earth"], ["天英", "英", "fire"]
];

function glyphs(value, dictionary) {
  const found = dictionary.filter(([key]) => value.includes(key));
  return {
    han: found.length ? found.map(item => item[1]).join(" · ") : "—",
    className: found[0]?.[2] || "earth"
  };
}

function stemGlyphs(value) {
  const stems = [...value].filter(char => STEM_INFO[char]);
  return {
    han: stems.length ? stems.join(" · ") : "—",
    className: stems.length === 1 ? STEM_INFO[stems[0]][1] : "water"
  };
}

function symbolBlock(kind, label, value, dictionary) {
  const symbol = dictionary ? glyphs(value, dictionary) : stemGlyphs(value);
  return `<span class="symbol ${kind}"><b class="${symbol.className}">${symbol.han}</b><small>${label}</small></span>`;
}

function renderFront(number, data, chart) {
  if (number === 5) {
    return `<span class="center-front">
      <b>Инь ${chart.method.ju}</b>
      <span>${chart.method.name} · ${chart.method.han}</span>
      <span>Расклад часа</span>
      <em class="center-stem">${data.et.slice(0, 1)}</em>
    </span><span class="palace-name">Центр 5</span>`;
  }
  const flags = [
    data.chief ? '<i class="mini-flag chief">符</i>' : "",
    data.chiefGate ? '<i class="mini-flag chief">使</i>' : "",
    chart.focus.day === number ? '<i class="mini-flag day">Д</i>' : "",
    chart.focus.hour === number ? '<i class="mini-flag hour">Ч</i>' : ""
  ].join("");
  return `
    ${symbolBlock("deity", "Дух", data.deity, DEITY_GLYPHS)}
    ${symbolBlock("gate", "Врата", data.gate, GATE_GLYPHS)}
    ${symbolBlock("heaven", "НТ", data.ht)}
    ${symbolBlock("star", "Звезда", data.star, STAR_GLYPHS)}
    ${symbolBlock("earth-stem", "ЗТ", data.et)}
    <span class="palace-name">${PALACES[number][0]} ${number}</span>
    <span class="palace-flags">${flags}</span>`;
}

function renderBack(number, data) {
  const [name, direction] = PALACES[number];
  const [element] = PALACE_ELEMENTS[number];
  return `
    <span class="back-head"><strong>${name} ${number}</strong><span>${direction} · ${element}</span></span>
    <span class="back-list">
      <span class="back-row"><span>Дух</span><b>${data.deity}</b></span>
      <span class="back-row"><span>Врата</span><b>${data.gate}</b></span>
      <span class="back-row"><span>Звезда</span><b>${data.star}</b></span>
      <span class="back-row"><span>НТ</span><b>${data.ht}</b></span>
      <span class="back-row"><span>ЗТ</span><b>${data.et}</b></span>
    </span>
    <span class="future-slot">Место для расширенного толкования дворца</span>`;
}

function renderPalace(number, data, chart, order) {
  const classes = ["palace-card"];
  if (number === 5) classes.push("center");
  if (chart.focus.day === number) classes.push("focus-day");
  if (chart.focus.hour === number) classes.push("focus-hour");
  if (flippedPalaces.has(number)) classes.push("is-flipped");
  const accessibleName = `${PALACES[number][0]} ${number}. Открыть русскую расшифровку`;
  return `<button class="${classes.join(" ")}" type="button" data-palace="${number}" style="--flip-order:${order}" aria-pressed="${flippedPalaces.has(number)}" aria-label="${accessibleName}">
    <span class="palace-inner">
      <span class="palace-face palace-front">${renderFront(number, data, chart)}</span>
      <span class="palace-face palace-back">${renderBack(number, data)}</span>
    </span>
  </button>`;
}

function renderPillars(chart) {
  const labels = { hour: "Час", day: "День", month: "Месяц", year: "Год" };
  const order = ["hour", "day", "month", "year"];
  $("pillar-board").innerHTML = order.map(name => {
    const pillar = chart.pillars[name];
    const stem = pillar.stem || pillar.han[0];
    const branch = pillar.branch || pillar.han[1];
    const stemInfo = STEM_INFO[stem];
    const branchInfo = BRANCH_INFO[branch];
    return `<article class="pillar ${name === "hour" ? "is-hour" : ""}">
      <div class="pillar-title">${labels[name]}</div>
      <div class="pillar-element">${stemInfo[0]}</div>
      <div class="pillar-symbol ${stemInfo[1]}">${stem}</div>
      <div class="pillar-symbol ${branchInfo[1]}">${branch}</div>
      <div class="pillar-animal">${branchInfo[0]}</div>
    </article>`;
  }).join("");
}

function displayPillar(pillar) { return `${pillar.han} ${pillar.ru}`; }

function updateFlipButton() {
  const allFlipped = flippedPalaces.size === PALACE_ORDER.length;
  $("flip-all").setAttribute("aria-pressed", String(allFlipped));
  $("flip-all").querySelector(".flip-label").textContent = allFlipped ? "Вернуть карту" : "Расшифровка";
}

function render(chart) {
  currentChart = chart;
  flippedPalaces.clear();
  $("form-message").textContent = "";
  $("result").hidden = false;
  $("chart-heading").textContent = chart.title;
  $("chart-moment").textContent = chart.moment;
  $("dun-badge").textContent = `阴遁${chart.method.ju}局 · Инь ${chart.method.ju} · ${chart.method.name}`;
  $("season").textContent = chart.method.season;
  $("xunshou").textContent = `${chart.xunshou} → ${chart.hiddenJia}`;
  $("zhifu").textContent = `${chart.chiefStar} · дворец ${chart.chiefTarget}`;
  $("zhishi").textContent = `${chart.chiefGate} · дворец ${chart.chiefGateTarget}`;
  $("pattern").textContent = chart.pattern;
  $("focus-summary").textContent = `День ${chart.pillars.day.stem} → дворец ${chart.focus.day}; час ${chart.pillars.hour.stem} → дворец ${chart.focus.hour}`;
  $("trace-list").innerHTML = chart.trace.map(step => `<li>${step}</li>`).join("");
  renderPillars(chart);
  $("palace-grid").innerHTML = PALACE_ORDER.map((number, index) => renderPalace(number, chart.palaces[number], chart, index)).join("");
  updateFlipButton();
}

function inputValues() {
  return {
    date: $("date").value,
    time: $("time").value,
    placeId: $("place").value,
    methodId: $("method").value,
    useTrueSolarTime: $("solar-time").checked
  };
}

function recalculate(event) {
  event?.preventDefault();
  try { render(calculateChart(inputValues())); }
  catch (error) {
    currentChart = null;
    $("result").hidden = true;
    $("form-message").textContent = error.message;
  }
}

$("palace-grid").addEventListener("click", event => {
  const card = event.target.closest(".palace-card");
  if (!card || !currentChart) return;
  const number = Number(card.dataset.palace);
  if (flippedPalaces.has(number)) flippedPalaces.delete(number);
  else flippedPalaces.add(number);
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

$("chart-form").addEventListener("submit", recalculate);
$("solar-time").addEventListener("change", () => {
  $("solar-hint").textContent = $("solar-time").checked ? "Включено" : "Выключено";
  recalculate();
});
$("method").addEventListener("change", recalculate);
recalculate();
