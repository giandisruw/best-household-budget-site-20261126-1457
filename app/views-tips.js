// RumahKu Budget — money tips view.
//
// Eight practical tips written for this household, with the real saving
// attached to each one. Filter by topic or search the text — both run
// instantly in the browser.

import { TIPS } from "./data.js";
import { escapeHtml } from "./format.js";

const TOPICS = ["All", "Habits", "Groceries", "Planning", "Bills", "Transport", "Fun", "Kids"];

function tipCard(tip) {
  return `
  <article class="card tip-card" data-topic="${tip.category}">
    <p class="card-label">${tip.category}</p>
    <h2>${escapeHtml(tip.title)}</h2>
    <p>${escapeHtml(tip.body)}</p>
    <p class="saving">Worth: ${escapeHtml(tip.saving)}</p>
  </article>`;
}

export function renderTips(topic = "All", query = "") {
  const needle = query.trim().toLowerCase();
  const shown = TIPS.filter((tip) => {
    if (topic !== "All" && tip.category !== topic) return false;
    if (!needle) return true;
    return (tip.title + " " + tip.body + " " + tip.category).toLowerCase().includes(needle);
  });

  return `
  <section class="page-head">
    <h1>Money tips that fit this household</h1>
    <p class="lede">Eight habits, each with the real saving attached. Nothing here needs an app
    subscription or a new bank account — just a list, an envelope and ten minutes a week.</p>
  </section>

  <section class="card">
    <div class="filter-row" role="group" aria-label="Filter tips by topic">
      ${TOPICS.map((item) => `<button class="chip ${topic === item ? "chip-active" : ""}" type="button" data-topic="${item}">${item}</button>`).join("")}
    </div>
    <label class="field-label">Search the tips
      <input id="tip-search" type="search" placeholder="e.g. market, fuel, envelope" value="${escapeHtml(query)}">
    </label>
    <p class="muted" id="tip-count" role="status">Showing ${shown.length} of ${TIPS.length} tips.</p>
  </section>

  <section class="tip-grid" id="tip-grid">
    ${shown.map(tipCard).join("") || `<p class="card">No tip matches that search — try “market”, “fuel” or “envelope”.</p>`}
  </section>

  <section class="card">
    <h2>The one rule behind all eight tips</h2>
    <p>Decide where the money goes <strong>before</strong> the month starts, not after it is gone.
    A plan written on the 1st beats willpower on the 20th — every time. The budget page holds the plan;
    this page holds the habits that keep it.</p>
  </section>`;
}

export function mountTips() {
  let topic = "All";
  const grid = document.getElementById("tip-grid");
  const count = document.getElementById("tip-count");
  const search = document.getElementById("tip-search");
  const apply = () => {
    const needle = (search ? search.value : "").trim().toLowerCase();
    const shown = TIPS.filter((tip) => {
      if (topic !== "All" && tip.category !== topic) return false;
      if (!needle) return true;
      return (tip.title + " " + tip.body + " " + tip.category).toLowerCase().includes(needle);
    });
    if (grid) grid.innerHTML = shown.map(tipCard).join("") || `<p class="card">No tip matches that search — try “market”, “fuel” or “envelope”.</p>`;
    if (count) count.textContent = `Showing ${shown.length} of ${TIPS.length} tips.`;
  };
  document.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      topic = button.getAttribute("data-topic");
      document.querySelectorAll("[data-topic]").forEach((other) =>
        other.classList.toggle("chip-active", other === button));
      apply();
    });
  });
  if (search) search.addEventListener("input", apply);
}
