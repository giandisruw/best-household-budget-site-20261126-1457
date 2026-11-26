# RumahKu Budget — Household Budget Site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/giandisruw/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/giandisruw/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-green.svg)](https://nodejs.org/)

A working household budget site for the Wijaya family of Surabaya — income,
spending, saving and goals for November 2026, with every figure real and
every control working. It runs entirely from its own files: no network
requests, no tracking, no account.

## What it does

- **Dashboard** — income Rp 21.500.000, spent Rp 18.230.000, saved Rp 3.270.000
  at a glance, a donut of where the money went, six months of income /
  spending / saving bars, the categories closest to their limit and the
  newest expenses.
- **Budget planner** — set a plan per category, save it, and the totals,
  used bars and statuses update at once. Three categories are over plan
  this month; the page says which and by how much.
- **Expenses** — all 16 purchases of the month, filterable by category,
  with an add form and a remove button. Adding an expense moves the
  category totals immediately.
- **Goals** — four savings goals (emergency fund, motorbike, Bali holiday,
  education) with progress bars, finish dates and one-tap contributions,
  plus a form to start a new goal.
- **Calculator** — the 50 / 30 / 20 split for any income, and a goal clock
  that says how many months a monthly contribution needs. Both update live.
- **Tips** — eight practical money habits written for this household, each
  with the real saving attached, filterable by topic and searchable.

Edits are saved in the browser's localStorage only — nothing leaves the
device, and the site works fully offline.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a browser (add `--port 8090` for another
port). The layout is responsive: the navigation wraps and the cards stack
on a phone.

## Hand it in (make.fun)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` into the output directory and
writes `dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts`.

## Files

| File | Job |
| --- | --- |
| `app/index.html` | Page shell, navigation, footer |
| `app/main.js` | Hash router and boot |
| `app/data.js` | Sample household data (income, categories, expenses, goals, tips) |
| `app/state.js` | Live state in localStorage, with save / edit helpers |
| `app/format.js` | Rupiah, percent and date formatting |
| `app/charts.js` | Canvas donut and six-month bar chart, no library |
| `app/views-dashboard.js` | Dashboard page |
| `app/views-budget.js` | Budget planner page |
| `app/views-expenses.js` | Expenses page |
| `app/views-goals.js` | Savings goals page |
| `app/views-calculator.js` | Calculator page |
| `app/views-tips.js` | Money tips page |
| `app/style.css` | The whole design, responsive |
| `main.ts` | Entrypoint: builds the make.fun output |
| `serve.ts` | Local static server for development |

## License

MIT — see [LICENSE](LICENSE).

---

Built for the make.fun bounty [best-household-budget-site-20261126-1457](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457). Use referral code `0txwmf1m` when you join make.fun.
