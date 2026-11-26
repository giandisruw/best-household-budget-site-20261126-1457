// RumahKu Budget — sample household data for November 2026.
//
// Everything on the site is real data from this file: the Wijaya family's
// income, the eight spending categories, the month's expenses, the savings
// goals, the six-month history and the money tips. Nothing here is fetched
// from the network; the state module copies this data into localStorage on
// first run so the family's own edits survive a reload.

export const HOUSEHOLD = {
  name: "Wijaya family",
  place: "Surabaya, Indonesia",
  month: "November 2026",
  monthShort: "Nov 2026",
  members: "2 adults + 2 children",
  currency: "IDR",
};

export const INCOME_SOURCES = [
  { id: "giandi-salary", label: "Giandi's salary", amount: 12500000, note: "Paid on the 25th" },
  { id: "partner-salary", label: "Partner's salary", amount: 7500000, note: "Paid on the 1st" },
  { id: "freelance", label: "Freelance & side income", amount: 1500000, note: "Design work, varies" },
];

export const CATEGORIES = [
  { id: "housing", label: "Housing & Rent", color: "#2e6b57", planned: 5000000, spent: 5000000 },
  { id: "groceries", label: "Groceries & Food", color: "#c08a1e", planned: 4500000, spent: 4820000 },
  { id: "transport", label: "Transport & Fuel", color: "#2f5d8a", planned: 1800000, spent: 1640000 },
  { id: "utilities", label: "Utilities & Bills", color: "#7a5aa0", planned: 1500000, spent: 1475000 },
  { id: "kids", label: "Kids & School", color: "#c04a7a", planned: 2000000, spent: 2150000 },
  { id: "health", label: "Health & Insurance", color: "#3a9a8a", planned: 1200000, spent: 1100000 },
  { id: "fun", label: "Fun & Eating Out", color: "#b4552d", planned: 1000000, spent: 1285000 },
  { id: "home", label: "Home & Clothing", color: "#7a7a4a", planned: 800000, spent: 760000 },
];

export const EXPENSES = [
  { id: "e01", date: "2026-11-02", category: "housing", note: "Monthly rent", amount: 5000000 },
  { id: "e02", date: "2026-11-03", category: "groceries", note: "Weekly market shop — rice, chicken, vegetables", amount: 685000 },
  { id: "e03", date: "2026-11-05", category: "transport", note: "Pertamax fuel, full tank", amount: 320000 },
  { id: "e04", date: "2026-11-06", category: "utilities", note: "Electricity (PLN) token", amount: 450000 },
  { id: "e05", date: "2026-11-07", category: "kids", note: "School books and stationery", amount: 540000 },
  { id: "e06", date: "2026-11-09", category: "groceries", note: "Supermarket — milk, eggs, fruit, snacks", amount: 912000 },
  { id: "e07", date: "2026-11-10", category: "fun", note: "Family dinner out, Saturday night", amount: 486000 },
  { id: "e08", date: "2026-11-12", category: "health", note: "BPJS top-up + pharmacy", amount: 385000 },
  { id: "e09", date: "2026-11-14", category: "transport", note: "Motorbike service + oil", amount: 275000 },
  { id: "e10", date: "2026-11-16", category: "groceries", note: "Weekly market shop — fish, tofu, tempeh", amount: 748000 },
  { id: "e11", date: "2026-11-18", category: "kids", note: "School excursion fee, both children", amount: 620000 },
  { id: "e12", date: "2026-11-20", category: "utilities", note: "Water (PDAM) + internet bill", amount: 512000 },
  { id: "e13", date: "2026-11-21", category: "fun", note: "Cinema tickets + popcorn", amount: 340000 },
  { id: "e14", date: "2026-11-23", category: "home", note: "New school shoes for the eldest", amount: 385000 },
  { id: "e15", date: "2026-11-24", category: "groceries", note: "Bulk rice 25 kg + cooking oil", amount: 612000 },
  { id: "e16", date: "2026-11-25", category: "health", note: "Dental check-up, youngest", amount: 290000 },
];

export const GOALS = [
  {
    id: "g-emergency",
    title: "Emergency fund",
    detail: "Six months of essentials, for the unexpected — a broken fridge, a hospital visit, a slow freelance month.",
    target: 30000000,
    saved: 12400000,
    monthly: 1000000,
  },
  {
    id: "g-motorbike",
    title: "New family motorbike",
    detail: "Replace the 2016 bike before it starts costing more in repairs than it is worth.",
    target: 18000000,
    saved: 6750000,
    monthly: 750000,
  },
  {
    id: "g-holiday",
    title: "Holiday in Bali",
    detail: "Five days in Ubud with the kids — flights, a family room and food, no credit card.",
    target: 9000000,
    saved: 4200000,
    monthly: 500000,
  },
  {
    id: "g-education",
    title: "Kids' education fund",
    detail: "A head start on next year's school fees and a small buffer for courses.",
    target: 50000000,
    saved: 8000000,
    monthly: 1500000,
  },
];

export const MONTHS = [
  { label: "Jun", income: 20500000, spent: 16200000 },
  { label: "Jul", income: 20800000, spent: 17100000 },
  { label: "Aug", income: 21200000, spent: 17500000 },
  { label: "Sep", income: 21000000, spent: 17900000 },
  { label: "Oct", income: 21500000, spent: 17850000 },
  { label: "Nov", income: 21500000, spent: 18230000 },
];

export const TIPS = [
  {
    id: "t-payday",
    category: "Habits",
    title: "Pay yourself first on payday",
    body: "Move the savings amount to a separate account the morning the salary lands — before any spending happens. For this family that is Rp 3.700.000 on the 25th. What stays in the spending account is what can be spent, and the decision is already made.",
    saving: "Rp 3.700.000 a month, protected",
  },
  {
    id: "t-market",
    category: "Groceries",
    title: "Shop the morning market twice a week",
    body: "A written list, a cash envelope of Rp 350.000 per trip, and no supermarket run without it. The family overspent groceries by Rp 320.000 this month — two planned market trips instead of four unplanned supermarket trips closes that gap.",
    saving: "About Rp 300.000 a month",
  },
  {
    id: "t-fifty",
    category: "Planning",
    title: "Use the 50 / 30 / 20 rule as a mirror, not a law",
    body: "Needs 50%, wants 30%, savings 20%. This month the family sits at 83% needs, 6% wants and 15% savings — the rule shows the pressure point is housing and food, not willpower. Use the calculator page to run your own numbers.",
    saving: "A plan that fits reality",
  },
  {
    id: "t-bills",
    category: "Bills",
    title: "Put every bill on one payday list",
    body: "Electricity, water, internet, BPJS and school fees all have a date and an amount on one page. Paying them in the first week removes late fees and the mental load of remembering them — and leaves the rest of the month calm.",
    saving: "No late fees, ever",
  },
  {
    id: "t-fuel",
    category: "Transport",
    title: "One fuel day a week",
    body: "Fill the tank once, on the same day, and keep a small log of kilometres. The family's transport came in Rp 160.000 under plan this month — that is the reward for batching errands instead of driving out for one thing at a time.",
    saving: "Rp 160.000 under plan this month",
  },
  {
    id: "t-fun",
    category: "Fun",
    title: "Give fun its own envelope",
    body: "Fun & Eating Out ran 28,5% over plan — the only category that blew past its limit by a wide margin. A fixed Rp 250.000 weekly fun envelope, cash in hand, keeps the cinema and the Saturday dinner without the creep.",
    saving: "About Rp 285.000 a month",
  },
  {
    id: "t-kids",
    category: "Kids",
    title: "Budget school costs by term, not by month",
    body: "Books, excursions and uniforms land in lumps, which is why Kids & School overspent by Rp 150.000. Divide the term's known costs by three and set that aside monthly — the month stops feeling like a surprise.",
    saving: "Smoother months, same total",
  },
  {
    id: "t-review",
    category: "Habits",
    title: "A ten-minute review every Sunday night",
    body: "Open this site, check the three categories closest to their limit, and move money between envelopes before the week starts. Ten minutes a week beats a three-hour money argument at the end of the month.",
    saving: "Fewer overruns, less stress",
  },
];

export function totalIncome() {
  return INCOME_SOURCES.reduce((sum, source) => sum + source.amount, 0);
}

export function totalPlanned(categories) {
  return categories.reduce((sum, category) => sum + category.planned, 0);
}

export function totalSpent(categories) {
  return categories.reduce((sum, category) => sum + category.spent, 0);
}

export function categoryById(id) {
  return CATEGORIES.find((category) => category.id === id) || null;
}
