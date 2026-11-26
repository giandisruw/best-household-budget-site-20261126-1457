// RumahKu Budget — household state.
//
// The family's live numbers live here. On first run the sample data is
// copied into localStorage; after that, every edit the family makes — a
// changed plan, a new expense, money added to a goal — is saved here and
// survives a reload. Nothing is sent anywhere: this is the household's own
// browser storage, and the site works fully offline.

import { CATEGORIES, EXPENSES, GOALS, INCOME_SOURCES } from "./data.js";

export const STORAGE_KEY = "rumahku-budget-v1";

function freshState() {
  return {
    income: INCOME_SOURCES.map((source) => ({ ...source })),
    categories: CATEGORIES.map((category) => ({ ...category })),
    expenses: EXPENSES.map((expense) => ({ ...expense })),
    goals: GOALS.map((goal) => ({ ...goal })),
  };
}

function loadStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.categories) || !Array.isArray(parsed.expenses)) return null;
    return parsed;
  } catch (error) {
    return null;
  }
}

function normalise(parsed) {
  // Keep the family's edits, but fill in anything a newer version added.
  const fresh = freshState();
  const byId = (list) => new Map(list.map((item) => [item.id, item]));
  const storedCategories = byId(parsed.categories);
  const categories = fresh.categories.map((category) => {
    const saved = storedCategories.get(category.id);
    return saved ? { ...category, ...saved } : category;
  });
  const storedGoals = byId(parsed.goals || []);
  const goals = fresh.goals.map((goal) => {
    const saved = storedGoals.get(goal.id);
    return saved ? { ...goal, ...saved } : goal;
  });
  return {
    income: Array.isArray(parsed.income) && parsed.income.length > 0 ? parsed.income : fresh.income,
    categories,
    expenses: Array.isArray(parsed.expenses) ? parsed.expenses : fresh.expenses,
    goals,
  };
}

export const state = normalise(loadStored() || freshState());

const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function save() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Storage full or blocked: the site keeps working for this session.
  }
  listeners.forEach((listener) => listener(state));
}

export function resetAll() {
  const fresh = freshState();
  state.income = fresh.income;
  state.categories = fresh.categories;
  state.expenses = fresh.expenses;
  state.goals = fresh.goals;
  save();
}

export function incomeTotal() {
  return state.income.reduce((sum, source) => sum + source.amount, 0);
}

export function plannedTotal() {
  return state.categories.reduce((sum, category) => sum + category.planned, 0);
}

export function spentTotal() {
  return state.categories.reduce((sum, category) => sum + category.spent, 0);
}

export function savedTotal() {
  return incomeTotal() - spentTotal();
}

export function categorySpent(categoryId) {
  return state.expenses
    .filter((expense) => expense.category === categoryId)
    .reduce((sum, expense) => sum + expense.amount, 0);
}

export function setPlan(categoryId, planned) {
  const category = state.categories.find((item) => item.id === categoryId);
  if (!category) return false;
  category.planned = Math.max(0, Math.round(planned));
  save();
  return true;
}

export function addExpense(expense) {
  const entry = {
    id: "e" + Date.now().toString(36),
    date: expense.date,
    category: expense.category,
    note: expense.note.trim(),
    amount: Math.max(0, Math.round(expense.amount)),
  };
  state.expenses.unshift(entry);
  const category = state.categories.find((item) => item.id === entry.category);
  if (category) category.spent += entry.amount;
  save();
  return entry;
}

export function removeExpense(expenseId) {
  const index = state.expenses.findIndex((expense) => expense.id === expenseId);
  if (index === -1) return false;
  const [removed] = state.expenses.splice(index, 1);
  const category = state.categories.find((item) => item.id === removed.category);
  if (category) category.spent = Math.max(0, category.spent - removed.amount);
  save();
  return true;
}

export function addToGoal(goalId, amount) {
  const goal = state.goals.find((item) => item.id === goalId);
  if (!goal) return false;
  goal.saved = Math.min(goal.target, goal.saved + Math.max(0, Math.round(amount)));
  save();
  return true;
}

export function addGoal(goal) {
  const entry = {
    id: "g" + Date.now().toString(36),
    title: goal.title.trim(),
    detail: goal.detail.trim(),
    target: Math.max(1000, Math.round(goal.target)),
    saved: Math.max(0, Math.round(goal.saved || 0)),
    monthly: Math.max(0, Math.round(goal.monthly || 0)),
  };
  state.goals.push(entry);
  save();
  return entry;
}
