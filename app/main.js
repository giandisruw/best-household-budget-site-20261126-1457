// RumahKu Budget — router and boot.
//
// Hash routes, one per page: #/dashboard, #/budget, #/expenses (with an
// optional /category filter), #/goals, #/calculator and #/tips. Each route
// renders its view into #view, runs its mount step (charts, forms and
// buttons), and marks the matching nav link active. State changes re-render
// the current route, so every edit shows up everywhere at once.

import { renderDashboard, mountDashboard } from "./views-dashboard.js";
import { renderBudget, mountBudget } from "./views-budget.js";
import { renderExpenses, mountExpenses } from "./views-expenses.js";
import { renderGoals, mountGoals } from "./views-goals.js";
import { renderCalculator, mountCalculator } from "./views-calculator.js";
import { renderTips, mountTips } from "./views-tips.js";
import { subscribe } from "./state.js";

const view = document.getElementById("view");

const ROUTES = {
  dashboard: { render: renderDashboard, mount: mountDashboard },
  budget: { render: renderBudget, mount: mountBudget },
  expenses: { render: renderExpenses, mount: mountExpenses },
  goals: { render: renderGoals, mount: mountGoals },
  calculator: { render: renderCalculator, mount: mountCalculator },
  tips: { render: renderTips, mount: mountTips },
};

function parseHash() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter((part) => part !== "");
  const name = ROUTES[parts[0]] ? parts[0] : "dashboard";
  return { name, param: parts[1] || null };
}

function setActiveNav(name) {
  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("data-route") === name);
    if (link.getAttribute("data-route") === name) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

export function renderRoute() {
  const { name, param } = parseHash();
  const route = ROUTES[name];
  view.innerHTML = route.render(param);
  setActiveNav(name);
  route.mount(param);
  window.scrollTo(0, 0);
  document.title = "RumahKu Budget — " + name.charAt(0).toUpperCase() + name.slice(1);
}

window.addEventListener("hashchange", renderRoute);
subscribe(() => renderRoute());

renderRoute();
