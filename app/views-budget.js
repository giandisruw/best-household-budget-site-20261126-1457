// RumahKu Budget — budget planner view: planned vs actual per category,
// editable plans, and the add-expense form. Every number is live from state.

import { pct, rp, sumActual, sumIncome, sumPlanned } from './format.js';
import { progressBar } from './charts.js';

function categoryRow(c) {
  const left = c.planned - c.actual;
  const over = left < 0;
  const status = over
    ? `<span class="tag over">Over by ${rp(-left)}</span>`
    : `<span class="tag ok-tag">${rp(left)} left</span>`;
  return `<tr>
    <td><span class="dot" style="background:${c.color}"></span> ${c.name}</td>
    <td class="num"><label class="sr" for="plan-${c.id}">Planned for ${c.name}</label><input id="plan-${c.id}" class="plan-input" type="number" min="0" step="50000" value="${c.planned}" data-category="${c.id}"></td>
    <td class="num">${rp(c.actual)}</td>
    <td>${progressBar(Math.min(1, c.actual / c.planned), over ? '#b3402e' : c.color)}</td>
    <td>${pct(c.actual, c.planned)} used</td>
    <td>${status}</td>
  </tr>`;
}

export function budgetView(state) {
  const income = sumIncome(state.income);
  const planned = sumPlanned(state.categories);
  const spent = sumActual(state.categories);
  const needsPlanned = ['housing', 'utilities', 'groceries', 'transport']
    .map((id) => state.categories.find((c) => c.id === id)?.planned ?? 0)
    .reduce((t, v) => t + v, 0);
  const groceries = state.categories.find((c) => c.id === 'groceries');
  const fun = state.categories.find((c) => c.id === 'fun');
  const options = state.categories
    .map((c) => `<option value="${c.id}">${c.name}</option>`)
    .join('');

  return `
<section class="page-head">
  <h1>Budget planner — ${state.month}</h1>
  <p class="lede">Set a plan for each category, then record spending as it happens. The plan totals ${rp(planned)} of ${rp(income)} income, leaving ${rp(income - planned)} to save. Change any plan below and press “Save plan” — the totals update at once.</p>
</section>

<section class="panel">
  <table class="budget">
    <thead><tr><th>Category</th><th class="num">Planned</th><th class="num">Spent</th><th>Used</th><th></th><th>Status</th></tr></thead>
    <tbody>${state.categories.map(categoryRow).join('')}</tbody>
    <tfoot><tr><td><strong>Total</strong></td><td class="num"><strong>${rp(planned)}</strong></td><td class="num"><strong>${rp(spent)}</strong></td><td colspan="3"><strong>${pct(spent, planned)} of plan used · ${rp(income - spent)} left to save</strong></td></tr></tfoot>
  </table>
  <p class="actions"><button class="btn" id="save-plan" type="button">Save plan</button> <span class="muted" id="plan-saved" role="status"></span></p>
</section>

<section class="split">
  <article class="panel">
    <h2>Add an expense</h2>
    <form id="add-expense">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>Category <select name="category">${options}</select></label>
      <label>What was it? <input type="text" name="note" maxlength="80" placeholder="e.g. Weekly supermarket shop" required></label>
      <label>Amount (Rp) <input type="number" name="amount" min="1" step="1000" placeholder="250000" required></label>
      <p class="actions"><button class="btn" type="submit">Add expense</button> <span class="muted" id="expense-added" role="status"></span></p>
    </form>
    <p class="muted small">Adding an expense raises that category's “Spent” and lowers the money left to save — the dashboard and the expenses page update with it.</p>
  </article>
  <article class="panel">
    <h2>How the plan is built</h2>
    <ul class="bullets">
      <li><strong>Needs first:</strong> housing, utilities, groceries and transport take ${rp(needsPlanned)} of the ${rp(planned)} plan.</li>
      <li><strong>Saving is a line, not a leftover:</strong> ${rp(income - planned)} (${pct(income - planned, income)}) is set aside before fun money.</li>
      <li><strong>Three flexible buckets</strong> — groceries, fun and home — are the only ones allowed to move between months.</li>
      <li><strong>Over plan?</strong> Move money from another category instead of from savings. This month groceries ran ${rp(groceries.actual - groceries.planned)} over; fun ran ${rp(fun.actual - fun.planned)} over.</li>
    </ul>
  </article>
</section>`;
}
