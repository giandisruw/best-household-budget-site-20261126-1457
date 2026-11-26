// RumahKu Budget — calculator view: the 50/30/20 split and a goal timeline.
// Both tools recompute live as the household types.

import { rp, splitIncome } from './format.js';

export const RULES = [
  { id: '50-30-20', label: '50 / 30 / 20 — balanced', rule: [50, 30, 20] },
  { id: '60-20-20', label: '60 / 20 / 20 — needs-heavy', rule: [60, 20, 20] },
  { id: '70-20-10', label: '70 / 20 / 10 — tight month', rule: [70, 20, 10] },
];

export function calculatorView(state) {
  const defaultIncome = 21500000;
  const split = splitIncome(defaultIncome, RULES[0].rule);
  const ruleOptions = RULES.map(
    (r) => `<option value="${r.id}">${r.label}</option>`,
  ).join('');

  return `
<section class="page-head">
  <h1>Budget calculator</h1>
  <p class="lede">Two quick tools. First, split any monthly income into needs, wants and saving. Second, see how long a savings goal takes at a monthly amount. Both work entirely in your browser — nothing leaves this page.</p>
</section>

<section class="split">
  <article class="panel">
    <h2>Split your income</h2>
    <form id="split-form">
      <label>Monthly income (Rp) <input type="number" id="split-income" min="0" step="100000" value="${defaultIncome}"></label>
      <label>Rule <select id="split-rule">${ruleOptions}</select></label>
    </form>
    <div id="split-result" class="calc-result" aria-live="polite">
      <p><span class="dot" style="background:#2f6f5e"></span>Needs (50%) — <strong>${rp(split.needs)}</strong></p>
      <p><span class="dot" style="background:#c98a2e"></span>Wants (30%) — <strong>${rp(split.wants)}</strong></p>
      <p><span class="dot" style="background:#3a6ea5"></span>Saving (20%) — <strong>${rp(split.savings)}</strong></p>
    </div>
    <p class="muted small">Needs are rent, food, transport, utilities, school and insurance. Wants are eating out, cinema and fun. This household's real split this month is about 70% needs, 6% wants, 15% saving — saving is below the 20% target because groceries and fun ran over.</p>
  </article>
  <article class="panel">
    <h2>How long to reach a goal?</h2>
    <form id="goal-form">
      <label>Goal amount (Rp) <input type="number" id="goal-target" min="0" step="100000" value="12000000"></label>
      <label>Already saved (Rp) <input type="number" id="goal-saved" min="0" step="100000" value="7800000"></label>
      <label>Saving per month (Rp) <input type="number" id="goal-monthly" min="0" step="50000" value="1000000"></label>
    </form>
    <p id="goal-result" class="calc-result" aria-live="polite">At Rp 1.000.000 a month, the Bali holiday (Rp 4.200.000 left) takes <strong>5 months</strong>.</p>
    <p class="muted small">Tip: saving this month's whole Rp 3.270.000 would finish it in 2 months — but the emergency fund comes first.</p>
  </article>
</section>

<section class="panel">
  <h2>What the numbers mean</h2>
  <ul class="bullets">
    <li><strong>50/30/20</strong> suits a household whose needs fit in half its income. On Rp 21.500.000 that is Rp 10.750.000 needs, Rp 6.450.000 wants, Rp 4.300.000 saving.</li>
    <li><strong>60/20/20</strong> fits this household better today: needs are really about Rp 12.900.000, and it still saves Rp 4.300.000.</li>
    <li><strong>70/20/10</strong> is a tight-month fallback — saving drops to Rp 2.150.000, so use it for one month only, never as the plan.</li>
    <li>Your saving rate is the number that matters most: saving divided by income. This month it is 15,2%.</li>
  </ul>
</section>`;
}
