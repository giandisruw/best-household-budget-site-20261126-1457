// RumahKu Budget — expenses view: the full transaction list with a category
// filter and a remove button on every row. Totals follow the filter.

import { rp, sumTransactions } from './format.js';

export function expensesView(state, filter = 'all') {
  const rows = state.transactions
    .filter((t) => filter === 'all' || t.category === filter)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const total = sumTransactions(rows);
  const catName = (id) => state.categories.find((c) => c.id === id)?.name ?? id;
  const options = ['all', ...state.categories.map((c) => c.id)]
    .map(
      (id) =>
        `<option value="${id}"${id === filter ? ' selected' : ''}>${id === 'all' ? 'All categories' : catName(id)}</option>`,
    )
    .join('');

  return `
<section class="page-head">
  <h1>Expenses — ${state.month}</h1>
  <p class="lede">Every rupiah this household spent in November 2026: ${state.transactions.length} transactions totalling ${rp(sumTransactions(state.transactions))}. Filter by category, or remove a mistaken entry — the totals and the budget update with it.</p>
</section>

<section class="panel">
  <p class="actions"><label>Show <select id="expense-filter">${options}</select></label>
  <span class="filter-total">Showing ${rows.length} of ${state.transactions.length} · total <strong>${rp(total)}</strong></span></p>
  <table class="tx">
    <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody>
      ${rows
        .map(
          (t) => `<tr><td>${t.date}</td><td>${t.note}</td><td>${catName(t.category)}</td><td class="num">${rp(t.amount)}</td><td><button class="link-btn" type="button" data-remove="${t.id}">Remove</button></td></tr>`,
        )
        .join('')}
    </tbody>
    <tfoot><tr><td colspan="3"><strong>Total shown</strong></td><td class="num"><strong>${rp(total)}</strong></td><td></td></tr></tfoot>
  </table>
  <p><a href="#/budget">Add a new expense in the budget planner →</a></p>
</section>

<section class="panel">
  <h2>Biggest single spends</h2>
  <ol class="bullets">
    ${[...state.transactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((t) => `<li>${t.note} — <strong>${rp(t.amount)}</strong> (${t.date}, ${catName(t.category)})</li>`)
      .join('')}
  </ol>
  <p class="muted">Rent is the biggest single line every month (Rp 4.500.000). After that, school fees (Rp 1.400.000) and the weekly shops lead the list.</p>
</section>`;
}
