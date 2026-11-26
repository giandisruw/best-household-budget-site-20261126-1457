// RumahKu Budget — tips view: short, specific guides for running a household
// budget, each tied to this month's real figures.

import { TIPS } from './data.js';

export function tipsView(state) {
  return `
<section class="page-head">
  <h1>Guides &amp; tips</h1>
  <p class="lede">Six habits that keep a household budget working, each with the numbers from this month so you can see exactly where it applies. Read one, try it this week.</p>
</section>

<section class="tips-grid">
  ${TIPS.map(
    (tip, i) => `<article class="panel tip-card">
      <p class="tip-num">${i + 1}</p>
      <h2>${tip.title}</h2>
      <p>${tip.body}</p>
    </article>`,
  ).join('')}
</section>

<section class="panel">
  <h2>A monthly routine that takes 20 minutes</h2>
  <ol class="bullets">
    <li><strong>1st of the month:</strong> write the plan — income and one planned figure per category. Copy last month, then adjust the three flexible buckets.</li>
    <li><strong>Every Sunday:</strong> record the week's spending (5 minutes) and check the two categories most likely to run over.</li>
    <li><strong>25th of the month:</strong> move whatever is left in groceries and fun to the emergency fund before it gets spent.</li>
    <li><strong>Last day:</strong> compare planned vs actual, move the month's saving to its goal, and start next month's plan.</li>
  </ol>
  <p><a href="#/budget">Back to the budget planner →</a></p>
</section>`;
}
