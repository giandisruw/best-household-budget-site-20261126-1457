// RumahKu Budget — router and wiring. Hash routes, one per page:
//   #/            dashboard        #/goals      savings goals
//   #/budget      budget planner   #/calculator budget calculator
//   #/expenses    expenses         #/tips       guides & tips
// Views return HTML strings; this file renders them and wires the controls.
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { loadState, addExpense, removeExpense, setPlanned, addToGoal, addGoal, resetState } from './state.js';
import { dashboardView } from './views-dashboard.js';
import { budgetView } from './views-budget.js';
import { expensesView } from './views-expenses.js';
import { goalsView } from './views-goals.js';
import { calculatorView, RULES } from './views-calculator.js';
import { tipsView } from './views-tips.js';
import { monthsToGoal, rp, splitIncome } from './format.js';

const app = document.getElementById('app');
const state = loadState();
let expenseFilter = 'all';

const ROUTES = {
  '': { title: 'RumahKu Budget — Household budget that adds up', view: dashboardView },
  budget: { title: 'Budget planner | RumahKu Budget', view: budgetView },
  expenses: { title: 'Expenses | RumahKu Budget', view: expensesView },
  goals: { title: 'Savings goals | RumahKu Budget', view: goalsView },
  calculator: { title: 'Budget calculator | RumahKu Budget', view: calculatorView },
  tips: { title: 'Guides & tips | RumahKu Budget', view: tipsView },
};

function currentRoute() {
  const match = location.hash.match(/^#\/([a-z]*)/);
  const name = match ? match[1] : '';
  return ROUTES[name] ? name : '';
}

function render() {
  window.__shotReady = false;
  const name = currentRoute();
  const route = ROUTES[name];
  document.title = route.title;
  app.innerHTML =
    name === 'expenses' ? expensesView(state, expenseFilter) : route.view(state);
  document.querySelectorAll('.nav-link').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#/' + name);
  });
  wire(name);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function wire(name) {
  if (name === 'budget') wireBudget();
  if (name === 'expenses') wireExpenses();
  if (name === 'goals') wireGoals();
  if (name === 'calculator') wireCalculator();
}

function wireBudget() {
  const form = document.getElementById('add-expense');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const row = addExpense(state, {
      date: data.get('date'),
      category: data.get('category'),
      note: data.get('note'),
      amount: data.get('amount'),
    });
    document.getElementById('expense-added').textContent = row
      ? `Added ${rp(row.amount)} to ${row.note}.`
      : 'Could not add that expense — check the amount.';
    if (row) {
      form.reset();
      render();
      // render() rebuilds the page, so say it again on the fresh element.
      document.getElementById('expense-added').textContent = `Added ${rp(row.amount)} to ${row.note}.`;
    }
  });
  document.getElementById('save-plan').addEventListener('click', () => {
    document.querySelectorAll('.plan-input').forEach((input) => {
      setPlanned(state, input.dataset.category, input.value);
    });
    document.getElementById('plan-saved').textContent = 'Plan saved.';
    render();
    // render() rebuilds the page, so say it again on the fresh element.
    document.getElementById('plan-saved').textContent = 'Plan saved.';
  });
}

function wireExpenses() {
  document.getElementById('expense-filter').addEventListener('change', (event) => {
    expenseFilter = event.target.value;
    render();
  });
  app.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      if (removeExpense(state, button.dataset.remove)) render();
    });
  });
}

function wireGoals() {
  app.querySelectorAll('.goal-add').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const amount = new FormData(form).get('amount');
      if (addToGoal(state, form.dataset.goal, amount)) render();
    });
  });
  const form = document.getElementById('add-goal');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const goal = addGoal(state, {
      name: data.get('name'),
      target: data.get('target'),
      saved: data.get('saved'),
      note: data.get('note'),
    });
    if (goal) {
      render();
      // render() rebuilds the page, so say it again on the fresh element.
      document.getElementById('goal-added').textContent = `Goal “${goal.name}” created.`;
    }
  });
}

function wireCalculator() {
  const incomeInput = document.getElementById('split-income');
  const ruleSelect = document.getElementById('split-rule');
  const result = document.getElementById('split-result');
  const updateSplit = () => {
    const income = Math.max(0, Math.round(Number(incomeInput.value) || 0));
    const rule = RULES.find((r) => r.id === ruleSelect.value) || RULES[0];
    const [needs, wants, savings] = rule.rule;
    const split = splitIncome(income, rule.rule);
    result.innerHTML =
      `<p><span class="dot" style="background:#2f6f5e"></span>Needs (${needs}%) — <strong>${rp(split.needs)}</strong></p>` +
      `<p><span class="dot" style="background:#c98a2e"></span>Wants (${wants}%) — <strong>${rp(split.wants)}</strong></p>` +
      `<p><span class="dot" style="background:#3a6ea5"></span>Saving (${savings}%) — <strong>${rp(split.savings)}</strong></p>`;
  };
  incomeInput.addEventListener('input', updateSplit);
  ruleSelect.addEventListener('change', updateSplit);

  const target = document.getElementById('goal-target');
  const saved = document.getElementById('goal-saved');
  const monthly = document.getElementById('goal-monthly');
  const out = document.getElementById('goal-result');
  const updateGoal = () => {
    const t = Math.max(0, Math.round(Number(target.value) || 0));
    const s = Math.max(0, Math.round(Number(saved.value) || 0));
    const m = Math.max(0, Math.round(Number(monthly.value) || 0));
    const months = monthsToGoal(t, s, m);
    if (s >= t) {
      out.innerHTML = 'That goal is already reached — well done!';
    } else if (!Number.isFinite(months)) {
      out.innerHTML = 'Saving Rp 0 a month never reaches the goal. Enter a monthly amount.';
    } else {
      out.innerHTML = `At ${rp(m)} a month, the ${rp(t - s)} left takes <strong>${months} month${months === 1 ? '' : 's'}</strong>.`;
    }
  };
  [target, saved, monthly].forEach((input) => input.addEventListener('input', updateGoal));
}

// Reset link in the footer (clears saved edits, back to the example month).
const resetLink = document.getElementById('reset-data');
if (resetLink) {
  resetLink.addEventListener('click', (event) => {
    event.preventDefault();
    const fresh = resetState();
    state.month = fresh.month;
    state.place = fresh.place;
    state.household = fresh.household;
    state.income = fresh.income;
    state.categories = fresh.categories;
    state.transactions = fresh.transactions;
    state.goals = fresh.goals;
    state.months = fresh.months;
    render();
  });
}

window.addEventListener('hashchange', render);
render();
