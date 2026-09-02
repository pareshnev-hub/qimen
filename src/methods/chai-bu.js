const YUAN_BY_BRANCH = { 子: "upper", 午: "upper", 卯: "upper", 酉: "upper", 寅: "middle", 申: "middle", 巳: "middle", 亥: "middle", 辰: "lower", 戌: "lower", 丑: "lower", 未: "lower" };
const JU = { upper: 1, middle: 4, lower: 7 };
const YUAN_RU = { upper: "верхняя", middle: "средняя", lower: "нижняя" };
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

export function calculateChaiBu({ pillars }) {
  let marker = pillars.day.index;
  while (![0, 5].includes(((marker % 10) + 10) % 10)) marker -= 1;
  const markerBranch = BRANCHES[((marker % 12) + 12) % 12];
  const yuan = YUAN_BY_BRANCH[markerBranch];
  return {
    id: "chai-bu", name: "Чай-Бу", han: "拆補法", dun: "yin", ju: JU[yuan], yuan,
    season: "处暑 Чу Шу · Завершение жары",
    trace: [
      `Метод <strong>Чай-Бу 拆補法</strong>: юань определяется по ближайшему Фу Тоу.`,
      `Фу Тоу относится к <strong>${YUAN_RU[yuan]} юань</strong>.`,
      `Для сезона 处暑 используется ряд <strong>1 · 4 · 7</strong>.`
    ]
  };
}
