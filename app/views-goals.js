// RumahKu Budget — savings goals view: progress per goal, add-money buttons
// and a form for a new goal of the household's own.

import { monthsToGoal, pct, rp, sumActual, sumIncome } from './format.js';
import { progressBar } from './charts.js';

export function goalsView(state) {
  const totalSaved = state.goals.reduce((t, g) => t + g.saved, 0);
  const totalTarget = state.goals.reduce((t, g) => t + g.target, 0);
  const monthlySaving = sumIncome(state.income) - sumActual(state.categories);

  return `
<section class="page-head">
  <h1>Savings goals</h1>
  <p class="lede">Four goals, ${rp(totalSaved)} saved of ${rp(totalTarget)} (${pct(totalSaved, totalTarget)}). The emergency fund comes first — the others wait their turn. Add money to any goal; the months-to-finish figure uses this month's saving of ${rp(monthlySaving)}.</p>
</section>

<section class="goal-grid">
  ${state.goals
    .map((g) => {
      const months = monthsToGoal(g.target, g.saved, monthlySaving);
      const done = g.saved >= g.target;
      return `<article class="panel goal-card">
      <h2>${g.name}</h2>
      <p class="goal-amount"><strong>${rp(g.saved)}</strong> <span class="muted">of ${rp(g.target)}</span></p>
      ${progressBar(g.saved / g.target, '#2f6f5e')}
      <p class="muted">${pct(g.saved, g.target)} saved · ${rp(g.target - g.saved)} to go</p>
      <p>${g.note}</p>
      <p class="muted">${done ? 'Goal reached — well done!' : `About ${months} month${months === 1 ? '' : 's'} left at this month's saving rate.`}</p>
      <form class="goal-add" data-goal="${g.id}">
        <label class="sr" for="add-${g.id}">Add to ${g.name}</label>
        <input id="add-${g.id}" type="number" name="amount" min="1000" step="10000" placeholder="500000" required>
        <button class="btn small" type="submit">Add to goal</button>
      </form>
    </article>`;
    })
    .join('')}
</section>

<section class="panel">
  <h2>Start a new goal</h2>
  <form id="add-goal">
    <label>Goal name <input type="text" name="name" maxlength="60" placeholder="e.g. New fridge" required></label>
    <label>Target amount (Rp) <input type="number" name="target" min="1000" step="50000" placeholder="5000000" required></label>
    <label>Already saved (Rp) <input type="number" name="saved" min="0" step="50000" value="0"></label>
    <label>Why this goal? <input type="text" name="note" maxlength="120" placeholder="e.g. The old one leaks"></label>
    <p class="actions"><button class="btn" type="submit">Create goal</button> <span class="muted" id="goal-added" role="status"></span></p>
  </form>
</section>`;
}
