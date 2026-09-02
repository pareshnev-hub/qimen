const TERM_JU = {
  chushu: { name: "处暑 Чу Шу · Завершение жары", index: 15, ju: [1, 4, 7] },
  bailu: { name: "白露 Бай Лу · Белые росы", index: 16, ju: [9, 3, 6] }
};
const YUAN_KEYS = ["upper", "middle", "lower"];
const YUAN_RU = ["верхняя", "средняя", "нижняя"];

export function calculateZhiRun({ pillars }) {
  const chushuDayIndex = 5;
  const daysSinceTerm = pillars.day.index - chushuDayIndex;
  const chaoshenDays = 5;
  const daysSinceFuTou = daysSinceTerm + chaoshenDays;
  let term = TERM_JU.chushu;
  let effectiveDay = daysSinceFuTou;
  if (daysSinceFuTou >= 15 && TERM_JU.chushu.index % 2 === 1) {
    term = TERM_JU.bailu;
    effectiveDay = daysSinceFuTou - 15;
  }
  const yuanIndex = Math.floor((effectiveDay % 15) / 5);
  return {
    id: "zhi-run", name: "Чжи Жунь", han: "置闰法", dun: "yin", ju: term.ju[yuanIndex],
    yuan: YUAN_KEYS[yuanIndex], season: term.name,
    trace: [
      `Метод <strong>Чжи Жунь 置闰法</strong>: считаем сутки от верхнего Фу Тоу.`,
      `Сверхбег до сезона 处暑: <strong>${chaoshenDays} суток</strong>; расчётный день цикла: <strong>${daysSinceFuTou}</strong>.`,
      `Расчётный сезон: <strong>${term.name}</strong>, ${YUAN_RU[yuanIndex]} юань; ряд <strong>${term.ju.join(" · ")}</strong>.`
    ]
  };
}
