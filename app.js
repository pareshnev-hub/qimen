const palaceOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

const names = {
  1: ["Кань", "Север"], 2: ["Кунь", "Юго-запад"], 3: ["Чжэнь", "Восток"],
  4: ["Сюнь", "Юго-восток"], 5: ["Центр", "Центр"], 6: ["Цянь", "Северо-запад"],
  7: ["Дуй", "Запад"], 8: ["Гэнь", "Северо-восток"], 9: ["Ли", "Юг"]
};

const charts = {
  "2026-09-02T19": {
    title: "Час Собаки · 甲戌 Цзя-Сюй",
    moment: "Сочи · 2 сентября 2026 · 19:00–20:59",
    pillars: ["丙午 Бин-У", "丙申 Бин-Шэнь", "己卯 Цзи-Мао", "甲戌 Цзя-Сюй"],
    dun: "阴遁一局", dunRu: "Инь Дунь · 1 цзюй", xunshou: "甲戌 → 己 Цзи",
    zhifu: "天英 Тянь Ин · Ли-9", zhishi: "景门 Цзин · Ли-9", pattern: "Практически Фу Инь",
    focus: { day: 9, hour: 9, text: "День 己 и час 甲戌 → Ли-9" },
    trace: [
      "Четыре столпа: <strong>丙午 / 丙申 / 己卯 / 甲戌</strong>",
      "Сезонный режим: <strong>Инь Дунь, 1 цзюй</strong>",
      "旬首 часа: <strong>甲戌</strong>, скрытый 甲 = <strong>己</strong>",
      "己 земной тарелки находится в <strong>Ли-9</strong>",
      "Исходные Чжи Фу и Чжи Ши остаются в <strong>Ли-9</strong>",
      "Небесная и земная тарелки почти совпадают: <strong>Фу Инь</strong>"
    ],
    palaces: {
      4: { deity:"螣蛇 Тэн Шэ", gate:"杜 Ду · Препятствие", star:"天辅 Тянь Фу", ht:"丁 Дин", et:"丁 Дин" },
      9: { deity:"值符 Чжи Фу", gate:"景 Цзин · Вид", star:"天英 Тянь Ин", ht:"己 Цзи", et:"己 Цзи", chief:true, chiefGate:true },
      2: { deity:"九天 Цзю Тянь", gate:"死 Сы · Смерть", star:"天芮 + 天禽", ht:"乙 И + 癸 Квэй", et:"乙 И" },
      3: { deity:"太阴 Тай Инь", gate:"伤 Шан · Ранение", star:"天冲 Тянь Чун", ht:"丙 Бин", et:"丙 Бин" },
      5: { deity:"—", gate:"—", star:"天禽 → с Тянь Жуй", ht:"—", et:"癸 Квэй" },
      7: { deity:"九地 Цзю Ди", gate:"惊 Цзин · Шок", star:"天柱 Тянь Чжу", ht:"辛 Синь", et:"辛 Синь" },
      8: { deity:"六合 Лю Хэ", gate:"生 Шэн · Жизнь", star:"天任 Тянь Жэнь", ht:"庚 Гэн", et:"庚 Гэн" },
      1: { deity:"白虎 Бай Ху", gate:"休 Сю · Отдых", star:"天蓬 Тянь Пэн", ht:"戊 Ву", et:"戊 Ву" },
      6: { deity:"玄武 Сюань У", gate:"开 Кай · Открытие", star:"天心 Тянь Синь", ht:"壬 Жэнь", et:"壬 Жэнь" }
    }
  },
  "2026-09-02T21": {
    title: "Час Свиньи · 乙亥 И-Хай",
    moment: "Сочи · 2 сентября 2026 · 21:00–22:59",
    pillars: ["丙午 Бин-У", "丙申 Бин-Шэнь", "己卯 Цзи-Мао", "乙亥 И-Хай"],
    dun: "阴遁一局", dunRu: "Инь Дунь · 1 цзюй", xunshou: "甲戌 → 己 Цзи",
    zhifu: "天英 Тянь Ин · Кунь-2", zhishi: "景门 Цзин · Гэнь-8", pattern: "Не Фу Инь",
    focus: { day: 2, hour: 7, text: "День 己 → Кунь-2 · Час 乙 → Дуй-7" },
    trace: [
      "Четыре столпа: <strong>丙午 / 丙申 / 己卯 / 乙亥</strong>",
      "Сезонный режим: <strong>Инь Дунь, 1 цзюй</strong>",
      "乙亥 входит в 旬 <strong>甲戌</strong>, скрытый 甲 = <strong>己</strong>",
      "己 земной тарелки находится в <strong>Ли-9</strong>",
      "Чжи Фу следует за часовым стволом и приходит в <strong>Кунь-2</strong>",
      "Чжи Ши движется обратным счётом и приходит в <strong>Гэнь-8</strong>"
    ],
    palaces: {
      4: { deity:"太阴 Тай Инь", gate:"惊 Цзин · Шок", star:"天冲 Тянь Чун", ht:"丙 Бин", et:"丁 Дин" },
      9: { deity:"螣蛇 Тэн Шэ", gate:"开 Кай · Открытие", star:"天辅 Тянь Фу", ht:"丁 Дин", et:"己 Цзи" },
      2: { deity:"值符 Чжи Фу", gate:"休 Сю · Отдых", star:"天英 Тянь Ин", ht:"己 Цзи", et:"乙 И", chief:true },
      3: { deity:"六合 Лю Хэ", gate:"死 Сы · Смерть", star:"天任 Тянь Жэнь", ht:"庚 Гэн", et:"丙 Бин" },
      5: { deity:"—", gate:"—", star:"天禽 → с Тянь Жуй", ht:"—", et:"癸 Квэй" },
      7: { deity:"九天 Цзю Тянь", gate:"生 Шэн · Жизнь", star:"天芮 + 天禽", ht:"乙 И + 癸 Квэй", et:"辛 Синь" },
      8: { deity:"白虎 Бай Ху", gate:"景 Цзин · Вид", star:"天蓬 Тянь Пэн", ht:"戊 Ву", et:"庚 Гэн", chiefGate:true },
      1: { deity:"玄武 Сюань У", gate:"杜 Ду · Препятствие", star:"天心 Тянь Синь", ht:"壬 Жэнь", et:"戊 Ву" },
      6: { deity:"九地 Цзю Ди", gate:"伤 Шан · Ранение", star:"天柱 Тянь Чжу", ht:"辛 Синь", et:"壬 Жэнь" }
    }
  }
};

const $ = (id) => document.getElementById(id);

function renderPalace(number, data, focus) {
  const [name, direction] = names[number];
  const tags = [];
  if (data.chief) tags.push('<span class="tag chief">值符 Чжи Фу</span>');
  if (data.chiefGate) tags.push('<span class="tag chief">值使 Чжи Ши</span>');
  if (focus.day === number) tags.push('<span class="tag day">День</span>');
  if (focus.hour === number) tags.push('<span class="tag hour">Час</span>');
  const classes = ["palace"];
  if (number === 5) classes.push("center");
  if (focus.day === number) classes.push("focus-day");
  if (focus.hour === number) classes.push("focus-hour");

  return `
    <article class="${classes.join(" ")}" data-number="${number}" aria-label="${name}-${number}">
      <div class="palace-head"><strong>${name}-${number}</strong><span>${direction}</span></div>
      <div class="palace-row"><span>Дух</span><strong>${data.deity}</strong></div>
      <div class="palace-row"><span>Врата</span><strong>${data.gate}</strong></div>
      <div class="palace-row"><span>Звезда</span><strong>${data.star}</strong></div>
      <div class="palace-row"><span>НТ / ЗТ</span><strong>${data.ht} / ${data.et}</strong></div>
      ${tags.length ? `<div class="palace-tags">${tags.join("")}</div>` : ""}
    </article>`;
}

function render(chart) {
  $("form-message").textContent = "";
  $("result").hidden = false;
  $("chart-heading").textContent = chart.title;
  $("chart-moment").textContent = chart.moment;
  $("dun-badge").innerHTML = `${chart.dun}<small>${chart.dunRu}</small>`;
  ["year", "month", "day", "hour"].forEach((name, index) => $(`${name}-pillar`).textContent = chart.pillars[index]);
  $("xunshou").textContent = chart.xunshou;
  $("zhifu").textContent = chart.zhifu;
  $("zhishi").textContent = chart.zhishi;
  $("pattern").textContent = chart.pattern;
  $("focus-summary").textContent = chart.focus.text;
  $("trace-list").innerHTML = chart.trace.map(step => `<li>${step}</li>`).join("");
  $("palace-grid").innerHTML = palaceOrder.map(number => renderPalace(number, chart.palaces[number], chart.focus)).join("");
}

$("chart-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const key = `${$("date").value}T${$("hour").value}`;
  const chart = charts[key];
  if (!chart) {
    $("result").hidden = true;
    $("form-message").textContent = "Для этой даты расчёт ещё не подключён. В прототипе доступны 02.09.2026, часы 19:00 и 21:00.";
    return;
  }
  render(chart);
});

render(charts["2026-09-02T21"]);
