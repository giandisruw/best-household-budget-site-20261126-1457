// RumahKu Budget — budget planner view.
//
// One editable row per category: change any plan, press "Save plan", and
// the totals, the used bars and the statuses update at once. The plan is
// saved in the browser, so next month starts from this month's numbers.

import { formatPercent, formatRupiah, parseAmount } from "./format.js";
import { incomeTotal, plannedTotal, savedTotal, setPlan, spentTotal, state } from "./state.js";

export function renderBudget() {
  const income = incomeTotal();
  const planned = plannedTotal();
  const spent = spentTotal();
  const leftToSave = income - planned;
  const usedOverall = planned > 0 ? (spent / planned) * 100 : 0;

  return `
  <section class="page-head">
    <h1>Budget planner — November 2026</h1>
    <p class="lede">Set a plan for each category, then record spending as it happens. The plan totals
    ${formatRupiah(planned)} of ${formatRupiah(income)} income, leaving ${formatRupiah(leftToSave)} to save.
    Change any plan below and press “Save plan” — the totals update at once.</p>
  </section>

  <section class="card">
    <form id="budget-form">
      <table class="budget-table">
        <thead>
          <tr><th>Category</th><th>Planned</th><th>Spent</th><th>Used</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${state.categories.map((category) => {
            const used = category.planned > 0 ? (category.spent / category.planned) * 100 : 0;
            const over = category.spent - category.planned;
            const status = over > 0
              ? `<span class="pill pill-over">Over by ${formatRupiah(over)}</span>`
              : `<span class="pill pill-ok">${formatRupiah(-over)} left</span>`;
            return `
          <tr>
            <td><span class="dot" style="background:${category.color}"></span> ${category.label}</td>
            <td><input class="plan-input" type="number" min="0" step="50000" name="plan-${category.id}" value="${category.planned}" aria-label="Planned amount for ${category.label}"></td>
            <td>${formatRupiah(category.spent)}</td>
            <td>
              <span class="used-bar"><span style="width:${Math.min(100, used)}%;background:${used > 100 ? "#b3402e" : category.color}"></span></span>
              ${formatPercent(used)} used
            </td>
            <td>${status}</td>
          </tr>`;
          }).join("")}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>${formatRupiah(planned)}</td>
            <td>${formatRupiah(spent)}</td>
            <td colspan="2">${formatPercent(usedOverall)} of plan used · ${formatRupiah(savedTotal())} left to save</td>
          </tr>
        </tfoot>
      </table>
      <p class="form-actions">
        <button class="btn btn-primary" type="submit">Save plan</button>
        <button class="btn btn-ghost" type="button" id="reset-plan">Reset to sample plan</button>
        <span class="form-note" id="budget-note" role="status"></span>
      </p>
    </form>
  </section>

  <section class="two-col">
    <div class="card">
      <h2>Three categories need attention</h2>
      <ul class="plain-list">
        <li><span class="dot" style="background:#b4552d"></span><span class="list-main">Fun &amp; Eating Out — 128,5% used, over by Rp 285.000</span></li>
        <li><span class="dot" style="background:#c08a1e"></span><span class="list-main">Groceries &amp; Food — 107,1% used, over by Rp 320.000</span></li>
        <li><span class="dot" style="background:#c04a7a"></span><span class="list-main">Kids &amp; School — 107,5% used, over by Rp 150.000</span></li>
      </ul>
      <p class="muted small">Fun is the only one far over. A Rp 250.000 weekly fun envelope fixes it without giving up the Saturday dinner.</p>
    </div>
    <div class="card">
      <h2>How the plan is built</h2>
      <p>Start from last month's real spending, not from a wish. Housing is fixed at
      ${formatRupiah(5000000)}; groceries and transport move with the season; everything left over
      after the eight categories is the saving target — ${formatRupiah(leftToSave)} this month, or
      ${formatPercent(leftToSave / income * 100)} of income.</p>
      <p><a href="#/calculator">Check the 50 / 30 / 20 split for this income →</a></p>
    </div>
  </section>`;
}

export function mountBudget() {
  const form = document.getElementById("budget-form");
  if (!form) return;
  const note = document.getElementById("budget-note");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let changed = 0;
    for (const category of state.categories) {
      const input = form.querySelector(`[name="plan-${category.id}"]`);
      if (!input) continue;
      const value = parseAmount(input.value);
      if (value !== category.planned) {
        setPlan(category.id, value);
        changed++;
      }
    }
    if (note) note.textContent = changed > 0
      ? `Plan saved — ${changed} categor${changed === 1 ? "y" : "ies"} updated.`
      : "Plan saved — nothing changed.";
  });
  const reset = document.getElementById("reset-plan");
  if (reset) {
    reset.addEventListener("click", () => {
      const defaults = { housing: 5000000, groceries: 4500000, transport: 1800000, utilities: 1500000, kids: 2000000, health: 1200000, fun: 1000000, home: 800000 };
      for (const category of state.categories) setPlan(category.id, defaults[category.id]);
      if (note) note.textContent = "Plan reset to the sample numbers.";
    });
  }
}
