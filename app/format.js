// RumahKu Budget — money formatting and month totals. Pure functions, no DOM.

// Format an IDR amount the Indonesian way: Rp 21.500.000 (no decimals).
export function rp(amount) {
  const n = Math.round(Number(amount) || 0);
  return 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Short form for chart labels: Rp 18,2 jt.
export function rpShort(amount) {
  const n = Number(amount) || 0;
  if (Math.abs(n) >= 1000000) {
    const v = n / 1000000;
    return 'Rp ' + (Number.isInteger(v) ? v : v.toFixed(1).replace('.', ',')) + ' jt';
  }
  if (Math.abs(n) >= 1000) return 'Rp ' + Math.round(n / 1000) + ' rb';
  return rp(n);
}

// One decimal percent, e.g. 15.2%.
export function pct(part, whole) {
  if (!whole) return '0%';
  return ((part / whole) * 100).toFixed(1).replace('.', ',') + '%';
}

export function sumIncome(income) {
  return income.reduce((t, row) => t + row.amount, 0);
}

export function sumPlanned(categories) {
  return categories.reduce((t, c) => t + c.planned, 0);
}

export function sumActual(categories) {
  return categories.reduce((t, c) => t + c.actual, 0);
}

export function sumTransactions(transactions) {
  return transactions.reduce((t, row) => t + row.amount, 0);
}

// Recompute a category's actual spend from the transaction list.
export function actualFor(transactions, categoryId) {
  return transactions
    .filter((row) => row.category === categoryId)
    .reduce((t, row) => t + row.amount, 0);
}

// 50/30/20 style split of a monthly income. `rule` is [needs, wants, savings] in percent.
export function splitIncome(income, rule) {
  const [needs, wants, savings] = rule;
  return {
    needs: Math.round((income * needs) / 100),
    wants: Math.round((income * wants) / 100),
    savings: Math.round((income * savings) / 100),
  };
}

// Months needed to reach a goal saving a fixed amount each month (Infinity = never).
export function monthsToGoal(target, saved, monthly) {
  const left = target - saved;
  if (left <= 0) return 0;
  if (!monthly || monthly <= 0) return Infinity;
  return Math.ceil(left / monthly);
}
