// RumahKu Budget — savings goals view.
//
// Four goals with a progress bar, a monthly contribution and a finish
// date each. Add money with one tap, or set a new goal of your own.

import { escapeHtml, formatPercent, formatRupiah, parseAmount } from "./format.js";
import { addGoal, addToGoal, state } from "./state.js";

function monthsToFinish(goal) {
  if (goal.saved >= goal.target) return "Done — fully funded";
  if (!goal.monthly || goal.monthly <= 0) return "Add a monthly amount to see a finish date";
  const months = Math.ceil((goal.target - goal.saved) / goal.monthly);
  const finish = new Date(2026, 10 + months, 1);
  const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return "About " + months + " more month" + (months === 1 ? "" : "s") + " · done around " + names[finish.getMonth()] + " " + finish.getFullYear();
}

export function renderGoals() {
  const totalSaved = state.goals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalTarget = state.goals.reduce((sum, goal) => sum + goal.target, 0);

  return `
  <section class="page-head">
    <h1>Savings goals</h1>
    <p class="lede">${formatRupiah(totalSaved)} saved towards ${formatRupiah(totalTarget)} across
    ${state.goals.length} goals. Add money with one tap — the bar and the finish date move at once.</p>
  </section>

  <section class="goal-grid">
    ${state.goals.map((goal) => {
      const percent = goal.target > 0 ? (goal.saved / goal.target) * 100 : 0;
      return `
    <article class="card goal-card">
      <h2>${escapeHtml(goal.title)}</h2>
      <p class="muted">${escapeHtml(goal.detail)}</p>
      <p class="goal-numbers"><strong>${formatRupiah(goal.saved)}</strong> of ${formatRupiah(goal.target)}</p>
      <div class="meter meter-tall"><span style="width:${Math.min(100, percent)}%"></span></div>
      <p class="muted small">${formatPercent(percent)} funded · ${formatRupiah(goal.target - goal.saved)} to go · ${formatRupiah(goal.monthly)} a month</p>
      <p class="muted small">${monthsToFinish(goal)}</p>
      <p class="goal-actions">
        <button class="btn btn-ghost" type="button" data-goal="${goal.id}" data-amount="100000">+ Rp 100.000</button>
        <button class="btn btn-ghost" type="button" data-goal="${goal.id}" data-amount="250000">+ Rp 250.000</button>
        <button class="btn btn-ghost" type="button" data-goal="${goal.id}" data-amount="500000">+ Rp 500.000</button>
      </p>
    </article>`;
    }).join("")}
  </section>

  <section class="card">
    <h2>Start a new goal</h2>
    <form id="goal-form" class="inline-form">
      <label class="wide">Goal <input type="text" name="title" maxlength="60" placeholder="e.g. New washing machine" required></label>
      <label class="wide">Why it matters <input type="text" name="detail" maxlength="120" placeholder="e.g. The old one leaks every wash"></label>
      <label>Target (Rp) <input type="number" name="target" min="100000" step="50000" placeholder="5000000" required></label>
      <label>Saved so far (Rp) <input type="number" name="saved" min="0" step="50000" placeholder="0"></label>
      <label>Monthly (Rp) <input type="number" name="monthly" min="0" step="50000" placeholder="250000"></label>
      <button class="btn btn-primary" type="submit">Add goal</button>
      <span class="form-note" id="goal-note" role="status"></span>
    </form>
  </section>`;
}

export function mountGoals() {
  document.querySelectorAll("[data-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      addToGoal(button.getAttribute("data-goal"), Number(button.getAttribute("data-amount")));
    });
  });
  const form = document.getElementById("goal-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const title = String(data.get("title") || "").trim();
      const target = parseAmount(String(data.get("target") || "0"));
      const status = document.getElementById("goal-note");
      if (!title || target <= 0) {
        if (status) status.textContent = "Give the goal a name and a target above Rp 0.";
        return;
      }
      addGoal({
        title,
        detail: String(data.get("detail") || ""),
        target,
        saved: parseAmount(String(data.get("saved") || "0")),
        monthly: parseAmount(String(data.get("monthly") || "0")),
      });
      if (status) status.textContent = "Goal added — “" + title + "” is on the list.";
      form.reset();
    });
  }
}
