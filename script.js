const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const blok = document.getElementById("blok");
const mainin = document.querySelector(".mainin");

const today = new Date();
const todayDay = today.getDate();
const todayMonth = today.getMonth();
const todayYear = today.getFullYear();

const totalMonths = 200 * 12;
const startYear = todayYear - 100;
const startMonth = 0;

const allDayCells = [];

function normalizeDate(year, month) {
  while (month < 0) { month += 12; year--; }
  while (month > 11) { month -= 12; year++; }
  return { year, month };
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function createMonthCard(year, month) {
  const div = document.createElement("div");
  div.className = "calendar-month";
  div.dataset.year = year;
  div.dataset.month = month;

  const title = document.createElement("h3");
  title.innerText = `${months[month]} ${year}`;
  div.appendChild(title);

  const week = document.createElement("div");
  week.className = "weekdays";
  weekDays.forEach(d => {
    const el = document.createElement("div");
    el.className = "weekday-label";
    el.innerText = d;
    week.appendChild(el);
  });
  div.appendChild(week);

  const daysGrid = document.createElement("div");
  daysGrid.className = "days-grid";

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const { year: py, month: pm } = normalizeDate(year, month - 1);
  const prevTotal = new Date(py, pm + 1, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const cell = document.createElement("div");
    cell.className = "day-cell other-month";
    cell.innerText = prevTotal - i;
    daysGrid.appendChild(cell);
  }

  for (let d = 1; d <= totalDays; d++) {
    const cell = document.createElement("div");
    cell.className = "day-cell";
    cell.innerText = d;
    cell.dataset.date = new Date(year, month, d).toDateString();

    if (d === todayDay && month === todayMonth && year === todayYear) {
      cell.classList.add("today");
    }

    allDayCells.push(cell);
    daysGrid.appendChild(cell);
  }

  const remaining = 42 - firstDay - totalDays;
  for (let d = 1; d <= remaining; d++) {
    const cell = document.createElement("div");
    cell.className = "day-cell other-month";
    cell.innerText = d;
    daysGrid.appendChild(cell);
  }

  div.appendChild(daysGrid);
  return div;
}

let currentMonthCard = null;

for (let i = 0; i < totalMonths; i++) {
  const { year, month } = normalizeDate(startYear, startMonth + i);
  const card = createMonthCard(year, month);
  blok.appendChild(card);

  if (year === todayYear && month === todayMonth) {
    currentMonthCard = card;
  }
}

if (currentMonthCard) {
  setTimeout(() => {
    mainin.scrollLeft = currentMonthCard.offsetLeft - mainin.offsetLeft - 10;
  }, 50);
}

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

rightBtn.addEventListener("click", () => mainin.scrollBy({ left: 500, behavior: "smooth" }));
leftBtn.addEventListener("click", () => mainin.scrollBy({ left: -500, behavior: "smooth" }));

function highlightRange(from, to) {
  const f = new Date(from); f.setHours(0, 0, 0, 0);
  const t = new Date(to); t.setHours(0, 0, 0, 0);

  allDayCells.forEach(cell => {
    cell.classList.remove("highlighted");
    if (!cell.dataset.date) return;

    const d = new Date(cell.dataset.date);
    d.setHours(0, 0, 0, 0);

    if (d >= f && d <= t) cell.classList.add("highlighted");
  });
}

const menuButtons = document.querySelectorAll(".days button");

menuButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    menuButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const label = btn.querySelector(".menu-item").innerText.toLowerCase().trim();
    const now = new Date(todayYear, todayMonth, todayDay);

    if (label === "today") {
      highlightRange(now, now);
      if (currentMonthCard) {
        mainin.scrollLeft = currentMonthCard.offsetLeft - mainin.offsetLeft - 10;
      }
    } else if (label === "yesterday") {
      const from = new Date(now);
      from.setDate(from.getDate() - 1);
      highlightRange(from, from);
      if (currentMonthCard) {
        mainin.scrollLeft = currentMonthCard.offsetLeft - mainin.offsetLeft - 10;
      }
    } else if (label === "last 7 days") {
      const from = new Date(now);
      from.setDate(from.getDate() - 6);
      highlightRange(from, now);
      if (currentMonthCard) {
        mainin.scrollLeft = currentMonthCard.offsetLeft - mainin.offsetLeft - 10;
      }
    } else if (label === "last 30 days") {
      const from = new Date(now);
      from.setDate(from.getDate() - 29);
      highlightRange(from, now);
      if (currentMonthCard) {
        mainin.scrollLeft = currentMonthCard.offsetLeft - mainin.offsetLeft - 510;
      }
    } else if (label === "last month") {
      const from = new Date(todayYear, todayMonth - 1, 1);
      const to = new Date(todayYear, todayMonth, 0);
      highlightRange(from, to);
      if (currentMonthCard) {
        mainin.scrollLeft = currentMonthCard.offsetLeft - mainin.offsetLeft - 510;
      }
    } else if (label === "this month") {
      const from = new Date(todayYear, todayMonth, 1);
      const to = new Date(todayYear, todayMonth + 1, 0);
      highlightRange(from, to);
      if (currentMonthCard) {
        mainin.scrollLeft = currentMonthCard.offsetLeft - mainin.offsetLeft - 10;
      }
    } else if (label === "next month") {
      const { year: ny, month: nm } = normalizeDate(todayYear, todayMonth + 1);
      const from = new Date(ny, nm, 1);
      const to = new Date(ny, nm + 1, 0);
      highlightRange(from, to);
      if (currentMonthCard) {
        mainin.scrollLeft = currentMonthCard.offsetLeft - mainin.offsetLeft - 10;
      }
    }
  });
});

const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");

dayInput.addEventListener("blur", () => {
  let value = Number(dayInput.value);
  if (!value || value < 1) value = 1;
  if (value > 31) value = 31;
  dayInput.value = value;
});

monthInput.addEventListener("blur", () => {
  let value = Number(monthInput.value);
  if (!value || value < 1) value = 1;
  if (value > 12) value = 12;
  monthInput.value = value;
});

yearInput.addEventListener("input", () => {
  yearInput.value = yearInput.value.replace(/[^0-9]/g, "");
});

document.getElementById("search").addEventListener("click", () => {
  const day = parseInt(dayInput.value);
  const month = parseInt(monthInput.value);
  const year = parseInt(yearInput.value);

  if (!day || !month || !year) {
    alert("Iltimos, kun, oy va yillani to'ldiring");
    return;
  }

  const searchDate = new Date(year, month - 1, day);

  if (
    searchDate.getFullYear() !== year ||
    searchDate.getMonth() !== month - 1 ||
    searchDate.getDate() !== day
  ) {
    alert("Noto'g'ri sana kiritilgan.");
    return;
  }

  highlightRange(searchDate, searchDate);

  const targetCard = [...blok.children].find(
    card =>
      parseInt(card.dataset.year) === year &&
      parseInt(card.dataset.month) === month - 1
  );

  if (targetCard) {
    mainin.scrollLeft = targetCard.offsetLeft - mainin.offsetLeft - 10;
  }
});

const todayBtn = document.getElementById("todayBtn");

todayBtn.innerText = `Today is ${months[todayMonth]} ${ordinal(todayDay)}`;

function checkTodayVisible() {
  if (!currentMonthCard) return;

  const mainRect = mainin.getBoundingClientRect();
  const cardRect = currentMonthCard.getBoundingClientRect();

  const isVisible = cardRect.left < mainRect.right && cardRect.right > mainRect.left;

  todayBtn.style.display = isVisible ? "none" : "block";
}

mainin.addEventListener("scroll", checkTodayVisible);

setTimeout(checkTodayVisible, 100);

todayBtn.addEventListener("click", () => {
  if (currentMonthCard) {
    mainin.scrollLeft = currentMonthCard.offsetLeft - mainin.offsetLeft - 10;
  }

  const now = new Date(todayYear, todayMonth, todayDay);
  highlightRange(now, now);
});