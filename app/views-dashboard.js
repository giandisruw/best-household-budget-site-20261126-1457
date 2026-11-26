// RumahKu Budget — dashboard view: the month at a glance.
// Shows the summary cards, the spending donut, the 6-month bars, overspend
// alerts, savings goals and the newest transactions. All figures come from state.

import { pct, rp, sumActual, sumIncome, sumPlanned } from './format.js';
import { donutChart, monthBars, progressBar } from './charts.js';

function overspendAlerts(state) {
  const over = state.categories.filter((c) => c.actual > c.planned);
  if (over.length === 0) {
    return '<p class="ok">Every category is within its plan this month. Nice work.</p>';
  }
  return (
    '<ul class="alerts">' +
    over
      .map(
        (c) =>
          `<li><strong>${c.name}</strong> is ${rp(c.actual - c.planned)} over plan ` +
          `(${rp(c.actual)} spent of ${rp(c.planned)} planned).</li>`,
      )
      .join('') +
    '</ul>'
  );
}

export function dashboardView(state) {
  const income = sumIncome(state.income);
  const planned = sumPlanned(state.categories);
  const spent = sumActual(state.categories);
  const saved = income - spent;
  const plannedSaved = income - planned;
  const newest = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6);
  const catName = (id) => state.categories.find((c) => c.id === id)?.name ?? id;
  const biggest = [...state.categories].sort((a, b) => b.actual - a.actual)[0];

  return `
<section class="hero">
  <div>
    <p class="eyebrow">${state.month} · ${state.place} · 2 adults + 2 children</p>
    <h1>Your household budget, in one place.</h1>
    <p class="lede">Income, spending, saving and goals for the Wijaya family — every figure below is this month's real plan and real spending, and every tool on this site works on it.</p>
    <p class="hero-links"><a class="btn" href="#/budget">Plan this month</a> <a class="btn ghost" href="#/calculator">Try the calculator</a></p>
  </div>
  <div class="hero-card">
    <p class="card-label">Money left to save</p>
    <p class="big">${rp(saved)}</p>
    <p class="muted">${pct(saved, income)} of income · plan was ${rp(plannedSaved)}</p>
    ${progressBar(saved / income, '#2f6f5e')}
    <p class="muted small">Plan: save ${rp(plannedSaved)} (${pct(plannedSaved, income)})</p>
  </div>
</section>

<section class="cards" aria-label="Month summary">
  <article class="card"><p class="card-label">Income</p><p class="figure">${rp(income)}</p><p class="muted">${state.income.map((i) => `${i.source}: ${rp(i.amount)}`).join(' · ')}</p></article>
  <article class="card"><p class="card-label">Spent so far</p><p class="figure">${rp(spent)}</p><p class="muted">Plan ${rp(planned)} · ${rp(spent - planned)} over plan</p></article>
  <article class="card"><p class="card-label">Saved so far</p><p class="figure">${rp(saved)}</p><p class="muted">${pct(saved, income)} savings rate · target 20%</p></article>
  <article class="card"><p class="card-label">Biggest category</p><p class="figure">${biggest.name.split(' ')[0]}</p><p class="muted">${rp(biggest.actual)} · ${pct(biggest.actual, spent)} of spending</p></article>
</section>

<section class="split">
  <article class="panel">
    <h2>Where the money went</h2>
    ${donutChart(state.categories, spent)}
  </article>
  <article class="panel">
    <h2>Six months: income, spending, saving</h2>
    ${monthBars(state.months)}
    <p class="muted">Saving climbed from Rp 2,9 jt in June to Rp 3,6 jt in October. November dips to Rp 3,27 jt because groceries and fun ran over plan.</p>
  </article>
</section>

<section class="split">
  <article class="panel">
    <h2>Over plan this month</h2>
    ${overspendAlerts(state)}
    <p><a href="#/budget">Open the budget planner →</a></p>
  </article>
  <article class="panel">
    <h2>Savings goals</h2>
    ${state.goals
      .slice(0, 2)
      .map(
        (g) =>
          `<p class="goal-line"><strong>${g.name}</strong> — ${rp(g.saved)} of ${rp(g.target)} (${pct(g.saved, g.target)})</p>${progressBar(g.saved / g.target)}`,
      )
      .join('')}
    <p><a href="#/goals">All savings goals →</a></p>
  </article>
</section>

<section class="panel">
  <h2>Latest spending</h2>
  <table class="tx">
    <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead>
    <tbody>
      ${newest.map((t) => `<tr><td>${t.date}</td><td>${t.note}</td><td>${catName(t.category)}</td><td class="num">${rp(t.amount)}</td></tr>`).join('')}
    </tbody>
  </table>
  <p><a href="#/expenses">All ${state.transactions.length} transactions →</a></p>
</section>`;
}
