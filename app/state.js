// RumahKu Budget — household state: the seeded example, plus the user's own edits.
// Edits are kept in localStorage (the site's own browser only, nothing is sent
// anywhere) and the seeded example is used whenever nothing is saved yet.
// In Node (tests) localStorage does not exist, so the seed is always used there.

import { CATEGORIES, GOALS, HOUSEHOLD, INCOME, MONTHS, TRANSACTIONS } from './data.js';
import { actualFor } from './format.js';

const STORE_KEY = 'rumahku-budget-v1';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function seedState() {
  return {
    month: HOUSEHOLD.month,
    place: HOUSEHOLD.place,
    household: HOUSEHOLD.name,
    income: clone(INCOME),
    categories: clone(CATEGORIES),
    transactions: clone(TRANSACTIONS),
    goals: clone(GOALS),
    months: clone(MONTHS),
  };
}

function storageAvailable() {
  try {
    return typeof localStorage !== 'undefined' && localStorage !== null;
  } catch {
    return false;
  }
}

export function loadState() {
  const state = seedState();
  if (!storageAvailable()) return state;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return state;
    const saved = JSON.parse(raw);
    if (saved && Array.isArray(saved.transactions)) {
      state.transactions = saved.transactions;
      state.categories = saved.categories || state.categories;
      state.goals = saved.goals || state.goals;
      state.income = saved.income || state.income;
      // Keep category actuals honest: they always equal the transactions.
      for (const c of state.categories) c.actual = actualFor(state.transactions, c.id);
    }
  } catch {
    // A damaged save is ignored; the seeded example still renders.
  }
  return state;
}

export function saveState(state) {
  if (!storageAvailable()) return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // Private mode or full storage: the page still works for this visit.
  }
}

export function resetState() {
  if (storageAvailable()) {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      // ignore
    }
  }
  return seedState();
}

// Add one expense: it appears in the list and raises its category's actual spend.
export function addExpense(state, expense) {
  const amount = Math.round(Number(expense.amount) || 0);
  if (amount <= 0) return null;
  const category = state.categories.find((c) => c.id === expense.category);
  if (!category) return null;
  const row = {
    id: 't' + Date.now().toString(36),
    date: expense.date || '2026-11-26',
    category: expense.category,
    note: String(expense.note || 'Expense').slice(0, 80) || 'Expense',
    amount,
  };
  state.transactions.push(row);
  category.actual = actualFor(state.transactions, category.id);
  saveState(state);
  return row;
}

// Remove one expense and lower its category's actual spend by the same amount.
export function removeExpense(state, id) {
  const index = state.transactions.findIndex((row) => row.id === id);
  if (index === -1) return false;
  const [removed] = state.transactions.splice(index, 1);
  const category = state.categories.find((c) => c.id === removed.category);
  if (category) category.actual = actualFor(state.transactions, category.id);
  saveState(state);
  return true;
}

// Change a category's monthly plan. The plan is a target, so actuals are untouched.
export function setPlanned(state, categoryId, planned) {
  const category = state.categories.find((c) => c.id === categoryId);
  if (!category) return false;
  const value = Math.max(0, Math.round(Number(planned) || 0));
  category.planned = value;
  saveState(state);
  return true;
}

// Add money to a savings goal (never past its target).
export function addToGoal(state, goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return false;
  const value = Math.max(0, Math.round(Number(amount) || 0));
  goal.saved = Math.min(goal.target, goal.saved + value);
  saveState(state);
  return true;
}

// Create a new savings goal of the user's own.
export function addGoal(state, goal) {
  const target = Math.round(Number(goal.target) || 0);
  if (!goal.name || target <= 0) return null;
  const row = {
    id: 'g' + Date.now().toString(36),
    name: String(goal.name).slice(0, 60),
    target,
    saved: Math.max(0, Math.round(Number(goal.saved) || 0)),
    note: String(goal.note || '').slice(0, 120),
  };
  state.goals.push(row);
  saveState(state);
  return row;
}
