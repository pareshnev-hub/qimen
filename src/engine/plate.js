import { DEITIES, EARTH_SEQUENCE, GATES, HIDDEN_JIA, RING, STARS, XUN_NAMES } from "../data/constants.js";

function palaceStep(palace, direction, steps = 1) {
  let result = palace;
  for (let i = 0; i < steps; i += 1) {
    result += direction;
    if (result === 10) result = 1;
    if (result === 0) result = 9;
    if (result === 5) result += direction;
  }
  return result;
}
function rotateRing(sourcePalace, shift) {
  const index = RING.indexOf(sourcePalace);
  return RING[(index + shift + RING.length) % RING.length];
}
function findEarthPalace(earth, stem) {
  return Number(Object.keys(earth).find(palace => earth[palace] === stem));
}

export function buildEarthPlate(dun, ju) {
  const direction = dun === "yang" ? 1 : -1;
  const earth = {};
  EARTH_SEQUENCE.forEach((stem, index) => {
    const palace = ((ju - 1 + direction * index) % 9 + 9) % 9 + 1;
    earth[palace] = stem;
  });
  return earth;
}

export function buildPlate({ dun, ju, pillars }) {
  const earth = buildEarthPlate(dun, ju);
  const xunIndex = Math.floor(pillars.hour.index / 10);
  const hiddenJia = HIDDEN_JIA[xunIndex];
  const xunshou = XUN_NAMES[xunIndex];
  const chiefOrigin = findEarthPalace(earth, hiddenJia);
  const chiefSource = chiefOrigin === 5 ? 2 : chiefOrigin;
  const hourTargetStem = pillars.hour.stem === "甲" ? hiddenJia : pillars.hour.stem;
  let chiefTarget = findEarthPalace(earth, hourTargetStem);
  if (chiefTarget === 5) chiefTarget = 2;

  const starShift = RING.indexOf(chiefTarget) - RING.indexOf(chiefSource);
  const starAt = {};
  const heaven = {};
  for (const source of RING) {
    const target = rotateRing(source, starShift);
    starAt[target] = STARS[source];
    heaven[target] = earth[source];
  }
  const ruiTarget = Number(Object.keys(starAt).find(palace => starAt[palace] === STARS[2]));
  starAt[ruiTarget] = `${STARS[2]} + ${STARS[5]}`;
  heaven[ruiTarget] = `${heaven[ruiTarget]} + ${earth[5]}`;

  const hourSteps = pillars.hour.index % 10;
  const gateDirection = dun === "yang" ? 1 : -1;
  const chiefGateOrigin = chiefOrigin === 5 ? 2 : chiefOrigin;
  const chiefGateTarget = palaceStep(chiefGateOrigin, gateDirection, hourSteps);
  const gateShift = RING.indexOf(chiefGateTarget) - RING.indexOf(chiefGateOrigin);
  const gateAt = {};
  for (const source of RING) gateAt[rotateRing(source, gateShift)] = GATES[source];

  const deityAt = {};
  DEITIES.forEach((deity, index) => { deityAt[rotateRing(chiefTarget, (dun === "yang" ? 1 : -1) * index)] = deity; });

  const palaces = {};
  for (let palace = 1; palace <= 9; palace += 1) {
    palaces[palace] = palace === 5
      ? { deity: "—", gate: "—", star: `${STARS[5]} → с Тянь Жуй`, ht: "—", et: `${earth[5]} ${stemRu(earth[5])}` }
      : { deity: deityAt[palace], gate: gateAt[palace], star: starAt[palace], ht: formatStemGroup(heaven[palace]), et: `${earth[palace]} ${stemRu(earth[palace])}`, chief: palace === chiefTarget, chiefGate: palace === chiefGateTarget };
  }

  const focusStem = stem => stem === "甲" ? hiddenJia : stem;
  const findHeaven = stem => Number(Object.keys(heaven).find(palace => heaven[palace].split(" + ").includes(stem)));
  const focus = { day: findHeaven(focusStem(pillars.day.stem)), hour: findHeaven(focusStem(pillars.hour.stem)) };
  const normalizedStarShift = ((starShift % 8) + 8) % 8;
  const normalizedGateShift = ((gateShift % 8) + 8) % 8;
  const voidBranchPairs = [["戌", "亥"], ["申", "酉"], ["午", "未"], ["辰", "巳"], ["寅", "卯"], ["子", "丑"]];
  const branchPalace = { 子:1, 丑:8, 寅:8, 卯:3, 辰:4, 巳:4, 午:9, 未:2, 申:2, 酉:7, 戌:6, 亥:6 };
  const voidBranches = voidBranchPairs[xunIndex];
  const voidPalaces = [...new Set(voidBranches.map(branch => branchPalace[branch]))];
  const horseByGroup = {
    申: "寅", 子: "寅", 辰: "寅",
    寅: "申", 午: "申", 戌: "申",
    亥: "巳", 卯: "巳", 未: "巳",
    巳: "亥", 酉: "亥", 丑: "亥"
  };
  const horseBranch = horseByGroup[pillars.hour.branch];
  const horsePalace = branchPalace[horseBranch];
  const chartNumber = ((dun === "yang" ? 0 : 9) + (ju - 1)) * 60 + pillars.hour.index + 1;
  const chartKey = `${dun}-${ju}-${String(pillars.hour.index).padStart(2, "0")}`;
  return {
    earth, palaces, xunshou, hiddenJia, chiefOrigin, chiefTarget, chiefGateTarget, focus,
    voidBranches, voidPalaces, horseBranch, horsePalace, chartNumber, chartKey,
    chiefStar: STARS[chiefSource], chiefGate: GATES[chiefGateOrigin],
    pattern: normalizedStarShift === 0 && normalizedGateShift === 0 ? "Фу Инь" : normalizedStarShift === 4 && normalizedGateShift === 4 ? "Фань Инь" : "Обычная ротация"
  };
}

function stemRu(stem) { return { 甲:"Цзя", 乙:"И", 丙:"Бин", 丁:"Дин", 戊:"Ву", 己:"Цзи", 庚:"Гэн", 辛:"Синь", 壬:"Жэнь", 癸:"Квэй" }[stem]; }
function formatStemGroup(group) { return group.split(" + ").map(stem => `${stem} ${stemRu(stem)}`).join(" + "); }
