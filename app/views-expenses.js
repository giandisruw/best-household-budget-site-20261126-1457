// RumahKu Budget — expenses view.
//
// The month's spending, one row per purchase, filterable by category.
// Add a purchase with the form and the category totals move at once;
// remove one and the money comes back.

import { categoryById } from "./data.js";
import { escapeHtml, formatDate, formatRupiah, parseAmount } from "./format.js";
import { addExpense, removeExpense, state } from "./state.js";

export function renderExpenses(filter = "all") {
  const categories = state.categories;
  const shown = filter === "all"
    ? state.expenses
    : state.expenses.filter((expense) => expense.category === filter);
  const shownTotal = shown.reduce((sum, expense) => sum + expense.amount, 0);
  const allTotal = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return `
  <section class="page-head">
    <h1>Expenses — November 2026</h1>
    <p class="lede">Every purchase this month, newest first. ${state.expenses.length} expenses recorded,
    totalling ${formatRupiah(allTotal)}. Add one below and the category totals move at once.</p>
  </section>

  <section class="card">
    <div class="filter-row" role="group" aria-label="Filter expenses by category">
      <a class="chip ${filter === "all" ? "chip-active" : ""}" href="#/expenses">All (${state.expenses.length})</a>
      ${categories.map((category) => {
        const count = state.expenses.filter((expense) => expense.category === category.id).length;
        return `<a class="chip ${filter === category.id ? "chip-active" : ""}" href="#/expenses/${category.id}">${category.label} (${count})</a>`;
      }).join("")}
    </div>
    <p class="muted">Showing ${shown.length} expense${shown.length === 1 ? "" : "s"} · ${formatRupiah(shownTotal)}</p>
    <table class="expense-table">
      <thead><tr><th>Date</th><th>What</th><th>Category</th><th>Amount</th><th></th></tr></thead>
      <tbody>
        ${shown.map((expense) => {
          const category = categoryById(expense.category);
          return `
        <tr>
          <td>${formatDate(expense.date)}</td>
          <td>${escapeHtml(expense.note)}</td>
          <td><span class="dot" style="background:${category ? category.color : "#999"}"></span> ${category ? category.label : expense.category}</td>
          <td>${formatRupiah(expense.amount)}</td>
          <td><button class="link-btn" type="button" data-remove="${expense.id}">Remove</button></td>
        </tr>`;
        }).join("") || `<tr><td colspan="5">No expenses in this category yet — add the first one below.</td></tr>`}
      </tbody>
    </table>
  </section>

  <section class="card">
    <h2>Add an expense</h2>
    <form id="expense-form" class="inline-form">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>Category
        <select name="category">
          ${categories.map((category) => `<option value="${category.id}">${category.label}</option>`).join("")}
        </select>
      </label>
      <label class="wide">What was it? <input type="text" name="note" maxlength="80" placeholder="e.g. Weekly market shop" required></label>
      <label>Amount (Rp) <input type="number" name="amount" min="1000" step="1000" placeholder="250000" required></label>
      <button class="btn btn-primary" type="submit">Add expense</button>
      <span class="form-note" id="expense-note" role="status"></span>
    </form>
  </section>`;
}

export function mountExpenses() {
  const form = document.getElementById("expense-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const note = String(data.get("note") || "").trim();
      const amount = parseAmount(String(data.get("amount") || "0"));
      const status = document.getElementById("expense-note");
      if (!note || amount <= 0) {
        if (status) status.textContent = "Write what it was and an amount above Rp 0.";
        return;
      }
      addExpense({
        date: String(data.get("date") || "2026-11-26"),
        category: String(data.get("category") || "groceries"),
        note,
        amount,
      });
      if (status) status.textContent = "Added — " + formatRupiah(amount) + " for “" + note + "”.";
      form.reset();
    });
  }
  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeExpense(button.getAttribute("data-remove")));
  });
}
