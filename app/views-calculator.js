// RumahKu Budget — calculator view.
//
// Two tools that run entirely in the browser:
// 1. The 50 / 30 / 20 split — needs, wants and savings for any income.
// 2. The goal clock — how many months a monthly contribution needs to
//    reach a target. Both update live as the numbers change.

import { formatPercent, formatRupiah, parseAmount } from "./format.js";
import { incomeTotal } from "./state.js";

function splitRows(income) {
  return [
    { label: "Needs — rent, food, bills, transport, school", share: 0.5, color: "#2e6b57" },
    { label: "Wants — eating out, cinema, fun", share: 0.3, color: "#c08a1e" },
    { label: "Savings & extra debt payments", share: 0.2, color: "#2f5d8a" },
  ].map((row) => ({ ...row, amount: income * row.share }));
}

export function renderCalculator() {
  const income = incomeTotal();
  const rows = splitRows(income);

  return `
  <section class="page-head">
    <h1>Budget calculator</h1>
    <p class="lede">Two quick tools. First, the 50 / 30 / 20 split for this household's income;
    change the income and the split follows. Second, how long a monthly contribution takes to reach a goal.</p>
  </section>

  <section class="two-col">
    <div class="card">
      <h2>The 50 / 30 / 20 split</h2>
      <label class="field-label">Monthly household income (Rp)
        <input id="calc-income" type="number" min="0" step="100000" value="${income}">
      </label>
      <div id="split-output">
        ${rows.map((row) => `
        <div class="split-row">
          <span class="dot" style="background:${row.color}"></span>
          <span class="list-main">${row.label}</span>
          <span class="list-right"><strong>${formatRupiah(row.amount)}</strong> · ${formatPercent(row.share * 100, 0)}</span>
        </div>`).join("")}
      </div>
      <div class="meter meter-tall"><span style="width:50%;background:#2e6b57"></span></div>
      <p class="muted small">This household actually spends about 83% on needs, 6% on wants and saves 15% —
      housing and food are heavy, so 50 / 30 / 20 is a direction here, not a pass mark. Try 60 / 25 / 15 if 50% needs is out of reach.</p>
    </div>

    <div class="card">
      <h2>How long until the goal?</h2>
      <label class="field-label">Goal amount (Rp)
        <input id="calc-target" type="number" min="0" step="100000" value="9000000">
      </label>
      <label class="field-label">Already saved (Rp)
        <input id="calc-saved" type="number" min="0" step="100000" value="4200000">
      </label>
      <label class="field-label">Monthly contribution (Rp)
        <input id="calc-monthly" type="number" min="0" step="50000" value="500000">
      </label>
      <p id="calc-result" class="calc-result" role="status"></p>
      <p class="muted small">Example above: the Bali holiday — Rp 9.000.000 target, Rp 4.200.000 saved,
      Rp 500.000 a month. Change any number and the answer updates.</p>
    </div>
  </section>

  <section class="card">
    <h2>What the numbers mean for this family</h2>
    <ul class="tips-list">
      <li><strong>Needs at 83% is not a failure.</strong> Rent alone is 23% of income; in Surabaya that is normal for a family of four. The lever is not rent — it is the three categories over plan.</li>
      <li><strong>Fun is the easiest win.</strong> Rp 285.000 over plan this month, with nothing to show for it but two extra dinners. A weekly envelope keeps the fun and removes the creep.</li>
      <li><strong>Every Rp 100.000 a month is Rp 1.200.000 a year.</strong> That is a quarter of the Bali holiday, from one small habit.</li>
    </ul>
  </section>`;
}

function updateSplit() {
  const input = document.getElementById("calc-income");
  const output = document.getElementById("split-output");
  if (!input || !output) return;
  const income = parseAmount(input.value);
  const rows = splitRows(income);
  output.innerHTML = rows.map((row) => `
    <div class="split-row">
      <span class="dot" style="background:${row.color}"></span>
      <span class="list-main">${row.label}</span>
      <span class="list-right"><strong>${formatRupiah(row.amount)}</strong> · ${formatPercent(row.share * 100, 0)}</span>
    </div>`).join("");
}

function updateGoalClock() {
  const target = parseAmount(document.getElementById("calc-target").value);
  const saved = parseAmount(document.getElementById("calc-saved").value);
  const monthly = parseAmount(document.getElementById("calc-monthly").value);
  const result = document.getElementById("calc-result");
  if (!result) return;
  const remaining = target - saved;
  if (remaining <= 0) {
    result.textContent = "Already there — you have saved the full " + formatRupiah(target) + ".";
    return;
  }
  if (monthly <= 0) {
    result.textContent = "Set a monthly contribution above Rp 0 to see how long it takes.";
    return;
  }
  const months = Math.ceil(remaining / monthly);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const span = years > 0
    ? years + " year" + (years === 1 ? "" : "s") + (rest > 0 ? " and " + rest + " months" : "")
    : months + " month" + (months === 1 ? "" : "s");
  result.textContent = formatRupiah(remaining) + " to go — at " + formatRupiah(monthly) +
    " a month that is " + span + " (" + months + " payments).";
}

export function mountCalculator() {
  const incomeInput = document.getElementById("calc-income");
  if (incomeInput) incomeInput.addEventListener("input", updateSplit);
  for (const id of ["calc-target", "calc-saved", "calc-monthly"]) {
    const input = document.getElementById(id);
    if (input) input.addEventListener("input", updateGoalClock);
  }
  updateGoalClock();
}
