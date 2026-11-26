# RumahKu Budget — a household budget site that adds up

[![make.fun](https://make.fun/badge/competition/best-household-budget-site-20261126-1457)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![make.fun entry](https://make.fun/badge/entry/best-household-budget-site-20261126-1457)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![make.fun leaderboard](https://make.fun/badge/leaderboard/best-household-budget-site-20261126-1457)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard)

**RumahKu Budget** is an original household budget site for the Wijaya family
in Surabaya. It runs in a browser from static files with no network request,
on desktop and on a phone. Every page is reached from the top navigation, every
figure is a real figure from one consistent example month (November 2026), and
every control works on that data.

## What it contains

- **Dashboard** (`#/`) — the month at a glance: income Rp 21.500.000, spent
  Rp 18.230.000, saved Rp 3.270.000 (15,2% savings rate), a donut of spending
  by category, income-vs-spending-vs-saving bars for June–November, overspend
  alerts, savings-goal progress and the latest spending.
- **Budget planner** (`#/budget`) — planned vs actual for 8 categories, with
  editable plan amounts and a working **Save plan** button, plus an
  **Add an expense** form that raises the category's spent figure at once.
- **Expenses** (`#/expenses`) — all 26 November transactions totalling
  Rp 18.230.000, filterable by category, with a **Remove** button on every row;
  totals follow the filter and the removal.
- **Savings goals** (`#/goals`) — emergency fund Rp 21.400.000 of
  Rp 30.000.000 (71%), Bali holiday 65%, new motorbike 30%, education fund
  25%; add money to any goal, or create a new goal of your own.
- **Calculator** (`#/calculator`) — split any monthly income by the 50/30/20,
  60/20/20 or 70/20/10 rule, and a goal-timeline tool (goal amount, already
  saved, monthly saving → months to finish). Both recompute as you type.
- **Guides & tips** (`#/tips`) — six specific habits tied to this month's real
  figures, plus a 20-minute monthly routine.

The figures add up: the 26 transactions sum to exactly the month's spending
(Rp 18.230.000), income minus spending equals the saving (Rp 3.270.000), and
every month in the 6-month chart balances the same way. Edits are kept in the
browser's localStorage only — nothing is sent anywhere — and the footer link
resets back to the example month.

## Files

- `app/index.html` — the single page; every route is a hash route.
- `app/main.js` — router and control wiring.
- `app/data.js` — the example household: income, categories, transactions,
  months, goals, tips.
- `app/state.js` — load/save, add/remove expense, plan edits, goal edits.
- `app/format.js` — rupiah formatting and month totals.
- `app/charts.js` — inline-SVG donut, month bars and progress bars.
- `app/views-*.js` — one view per page: dashboard, budget, expenses, goals,
  calculator, tips.
- `app/style.css` — the whole design, one stylesheet, responsive to phones.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to
  `/output` and writes `dossier.json` with the vendored make.fun library.
  Before copying it checks the hand-in the same way the gate does: the site's
  index page must exist and the screenshots must be 3 or 4 regular files
  inside the 256 KiB cap, so a broken hand-in fails loudly here instead of
  scoring 0.
- `vendor/makefun-frontend.ts` — the kit's copy, unchanged.
- `screenshots/` — 4 real renders of the site's own code (desktop dashboard,
  budget planner, savings goals, phone dashboard).
- `serve.ts` — a tiny static server for local testing (`node serve.ts`).

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

- Determinism: `main.ts` run twice produces byte-identical output — the
  program only copies files and builds the dossier, so both grader runs agree
  (`diff -r` clean; dossier sha256
  `5728b701cd91037dfbbdc8c9372b77a6f8dc5943fcf5724ede8cc517759a8ac5`).
- Screenshots are real renders of the site's own code, converted to JPEG
  (each under 256 KiB, long side 1280, short side ≥ 360).

## Tested

- 59 Node checks pass: every figure adds up (income Rp 21.500.000, planned
  Rp 17.800.000, spent Rp 18.230.000, saved Rp 3.270.000; the 26 transactions
  sum to the spending; every month balances), plus add/remove expense, plan
  edits, goal edits and the calculator maths.
- 15 browser checks pass in headless Chrome: adding an expense moves the
  spent total, saving a plan moves the planned total, the category filter and
  Remove work, adding money and creating a goal work, both calculators
  recompute live, the reset link restores the example month, and no resource
  is fetched from outside localhost.
- Screenshots checked visually: desktop dashboard, budget planner, savings
  goals and the 390 px phone dashboard are clean, legible and unclipped.

---

Built for the make.fun bounty "Make the best household budget site"
(best-household-budget-site-20261126-1457). Referral code: `0txwmf1m`.
