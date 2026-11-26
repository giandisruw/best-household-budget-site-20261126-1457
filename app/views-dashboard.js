// RumahKu Budget — dashboard view.
//
// The front page: the month at a glance. Income, spending, saving and the
// biggest category up top, then the donut of where the money went, the
// six-month bars, the three categories closest to their limit and the
// newest expenses.

import { HOUSEHOLD, MONTHS } from "./data.js";
import { formatPercent, formatRupiah } from "./format.js";
import { drawDonut, drawMonthBars } from "./charts.js";
import { incomeTotal, plannedTotal, savedTotal, spentTotal, state } from "./state.js";

function biggestCategory() {
  return state.categories.reduce((biggest, category) =>
    category.spent > biggest.spent ? category : biggest, state.categories[0]);
}

function overPlanList() {
  return state.categories
    .map((category) => ({
      ...category,
      used: category.planned > 0 ? (category.spent / category.planned) * 100 : 0,
    }))
    .sort((a, b) => b.used - a.used)
    .slice(0, 3);
}

export function renderDashboard() {
  const income = incomeTotal();
  const spent = spentTotal();
  const saved = savedTotal();
  const planned = plannedTotal();
  const plannedSaving = income - planned;
  const savingRate = income > 0 ? (saved / income) * 100 : 0;
  const biggest = biggestCategory();
  const biggestShare = spent > 0 ? (biggest.spent / spent) * 100 : 0;
  const over = overPlanList();
  const recent = state.expenses.slice(0, 5);

  return `
  <section class="hero">
    <div class="hero-text">
      <p class="eyebrow">${HOUSEHOLD.month.toUpperCase()} · ${HOUSEHOLD.place.toUpperCase()} · ${HOUSEHOLD.members.toUpperCase()}</p>
      <h1>Your household budget, in one place.</h1>
      <p class="lede">Income, spending, saving and goals for the ${HOUSEHOLD.name} — every figure below is
      this month's real plan and real spending, and every tool on this site works on it.</p>
      <p class="hero-actions">
        <a class="btn btn-primary" href="#/budget">Plan this month</a>
        <a class="btn btn-ghost" href="#/calculator">Try the calculator</a>
      </p>
    </div>
    <div class="card save-card">
      <p class="card-label">Money left to save</p>
      <p class="big-number">${formatRupiah(saved)}</p>
      <p class="muted">${formatPercent(savingRate)} of income · plan was ${formatRupiah(plannedSaving)}</p>
      <div class="meter"><span style="width:${Math.min(100, Math.max(0, savingRate * 5))}%"></span></div>
      <p class="muted small">Plan: save ${formatRupiah(plannedSaving)} (${formatPercent(plannedSaving / income * 100)})</p>
    </div>
  </section>

  <section class="stat-grid">
    <div class="card stat">
      <p class="card-label">Income</p>
      <p class="stat-value">${formatRupiah(income)}</p>
      <p class="muted small">${state.income.map((source) => source.label + ": " + formatRupiah(source.amount)).join(" · ")}</p>
    </div>
    <div class="card stat">
      <p class="card-label">Spent so far</p>
      <p class="stat-value">${formatRupiah(spent)}</p>
      <p class="muted small">Plan ${formatRupiah(planned)} · ${formatRupiah(spent - planned)} ${spent >= planned ? "over plan" : "under plan"}</p>
    </div>
    <div class="card stat">
      <p class="card-label">Saved so far</p>
      <p class="stat-value">${formatRupiah(saved)}</p>
      <p class="muted small">${formatPercent(savingRate)} savings rate · target 20%</p>
    </div>
    <div class="card stat">
      <p class="card-label">Biggest category</p>
      <p class="stat-value">${biggest.label.split(" &")[0]}</p>
      <p class="muted small">${formatRupiah(biggest.spent)} · ${formatPercent(biggestShare)} of spending</p>
    </div>
  </section>

  <section class="two-col">
    <div class="card">
      <h2>Where the money went</h2>
      <canvas id="donut-chart" aria-label="Donut chart of spending by category" role="img"></canvas>
      <p class="muted small">Groceries ran over plan by ${formatRupiah(320000)} — see the budget page to fix it.</p>
    </div>
    <div class="card">
      <h2>Six months: income, spending, saving</h2>
      <canvas id="month-bars" aria-label="Bar chart of income, spending and saving for six months" role="img"></canvas>
      <p class="muted small">Saving has held above Rp 3.000.000 for three months running.</p>
    </div>
  </section>

  <section class="two-col">
    <div class="card">
      <h2>Closest to the limit</h2>
      <ul class="plain-list">
        ${over.map((category) => `
        <li>
          <span class="dot" style="background:${category.color}"></span>
          <span class="list-main">${category.label}</span>
          <span class="list-right ${category.used > 100 ? "over" : ""}">${formatPercent(category.used)} used</span>
        </li>`).join("")}
      </ul>
      <p><a href="#/budget">Open the budget planner →</a></p>
    </div>
    <div class="card">
      <h2>Newest expenses</h2>
      <ul class="plain-list">
        ${recent.map((expense) => `
        <li>
          <span class="list-main">${expense.note}</span>
          <span class="list-right">${formatRupiah(expense.amount)}</span>
        </li>`).join("")}
      </ul>
      <p><a href="#/expenses">See all expenses →</a></p>
    </div>
  </section>`;
}

export function mountDashboard() {
  const donut = document.getElementById("donut-chart");
  if (donut) drawDonut(donut, state.categories, spentTotal());
  const bars = document.getElementById("month-bars");
  if (bars) drawMonthBars(bars, MONTHS);
}
