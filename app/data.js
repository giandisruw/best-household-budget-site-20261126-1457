// RumahKu Budget — seed data for the Wijaya household, Surabaya, November 2026.
// Every figure below is one consistent example month: the category actuals add up
// to the month's spending, and income minus spending equals the month's saving.
// Amounts are Indonesian rupiah (IDR).

export const HOUSEHOLD = {
  name: 'The Wijaya Family',
  place: 'Surabaya, Indonesia',
  members: '2 adults + 2 children',
  month: 'November 2026',
  currency: 'IDR',
};

export const INCOME = [
  { source: "Giandi's salary", amount: 12500000 },
  { source: "Partner's salary", amount: 7500000 },
  { source: 'Freelance & side income', amount: 1500000 },
];

export const CATEGORIES = [
  { id: 'housing', name: 'Housing & Rent', color: '#2f6f5e', planned: 5000000, actual: 5000000 },
  { id: 'groceries', name: 'Groceries & Food', color: '#c98a2e', planned: 4500000, actual: 4820000 },
  { id: 'transport', name: 'Transport & Fuel', color: '#3a6ea5', planned: 1800000, actual: 1640000 },
  { id: 'utilities', name: 'Utilities & Bills', color: '#7a5aa6', planned: 1500000, actual: 1475000 },
  { id: 'kids', name: 'Kids & School', color: '#c25b7a', planned: 2000000, actual: 2150000 },
  { id: 'health', name: 'Health & Insurance', color: '#4a9a8f', planned: 1200000, actual: 1100000 },
  { id: 'fun', name: 'Fun & Eating Out', color: '#b85c38', planned: 1000000, actual: 1285000 },
  { id: 'home', name: 'Home & Clothing', color: '#6b7c5e', planned: 800000, actual: 760000 },
];

export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', category: 'housing', note: 'Monthly house rent', amount: 4500000 },
  { id: 't02', date: '2026-11-03', category: 'housing', note: 'Home insurance premium', amount: 500000 },
  { id: 't03', date: '2026-11-02', category: 'groceries', note: 'Weekly supermarket shop', amount: 1250000 },
  { id: 't04', date: '2026-11-09', category: 'groceries', note: 'Weekly supermarket shop', amount: 1180000 },
  { id: 't05', date: '2026-11-16', category: 'groceries', note: 'Weekly supermarket shop', amount: 1310000 },
  { id: 't06', date: '2026-11-23', category: 'groceries', note: 'Traditional market & fruit', amount: 1080000 },
  { id: 't07', date: '2026-11-04', category: 'transport', note: 'Petrol — family car', amount: 420000 },
  { id: 't08', date: '2026-11-12', category: 'transport', note: 'Petrol — family car', amount: 380000 },
  { id: 't09', date: '2026-11-18', category: 'transport', note: 'Motorbike service & oil', amount: 540000 },
  { id: 't10', date: '2026-11-25', category: 'transport', note: 'Parking & tolls', amount: 300000 },
  { id: 't11', date: '2026-11-05', category: 'utilities', note: 'Electricity (PLN)', amount: 620000 },
  { id: 't12', date: '2026-11-06', category: 'utilities', note: 'Water (PDAM)', amount: 180000 },
  { id: 't13', date: '2026-11-07', category: 'utilities', note: 'Home internet', amount: 350000 },
  { id: 't14', date: '2026-11-08', category: 'utilities', note: 'Mobile phones — 2 lines', amount: 325000 },
  { id: 't15', date: '2026-11-02', category: 'kids', note: 'School fees — November', amount: 1400000 },
  { id: 't16', date: '2026-11-11', category: 'kids', note: 'Books & stationery', amount: 410000 },
  { id: 't17', date: '2026-11-20', category: 'kids', note: 'School field trip', amount: 340000 },
  { id: 't18', date: '2026-11-01', category: 'health', note: 'Health insurance (BPJS + private)', amount: 750000 },
  { id: 't19', date: '2026-11-14', category: 'health', note: 'Pharmacy — vitamins & medicine', amount: 210000 },
  { id: 't20', date: '2026-11-22', category: 'health', note: 'Dentist check-up', amount: 140000 },
  { id: 't21', date: '2026-11-15', category: 'fun', note: 'Family dinner out', amount: 485000 },
  { id: 't22', date: '2026-11-17', category: 'fun', note: 'Cinema — family movie night', amount: 320000 },
  { id: 't23', date: '2026-11-10', category: 'fun', note: 'Streaming subscriptions', amount: 180000 },
  { id: 't24', date: '2026-11-24', category: 'fun', note: 'Weekend picnic supplies', amount: 300000 },
  { id: 't25', date: '2026-11-13', category: 'home', note: 'School uniforms — 2 sets', amount: 460000 },
  { id: 't26', date: '2026-11-19', category: 'home', note: 'Cleaning supplies', amount: 300000 },
];

export const MONTHS = [
  { month: 'Jun', income: 20000000, spent: 17100000, saved: 2900000 },
  { month: 'Jul', income: 20500000, spent: 17600000, saved: 2900000 },
  { month: 'Aug', income: 21000000, spent: 18000000, saved: 3000000 },
  { month: 'Sep', income: 21500000, spent: 18400000, saved: 3100000 },
  { month: 'Oct', income: 21500000, spent: 17900000, saved: 3600000 },
  { month: 'Nov', income: 21500000, spent: 18230000, saved: 3270000 },
];

export const GOALS = [
  { id: 'g1', name: 'Emergency fund', target: 30000000, saved: 21400000, note: '6 months of essentials — the safety net first.' },
  { id: 'g2', name: 'Bali family holiday', target: 12000000, saved: 7800000, note: 'Flights, hotel and food for 4, next school break.' },
  { id: 'g3', name: 'New motorbike', target: 18000000, saved: 5400000, note: 'Replace the 2015 bike before it needs big repairs.' },
  { id: 'g4', name: 'Kids education fund', target: 50000000, saved: 12500000, note: 'School fees and university savings, built monthly.' },
];

export const TIPS = [
  {
    title: 'Pay yourself first',
    body: 'Move saving out of your salary on payday, before any spending. This household saves Rp 3,270,000 of Rp 21,500,000 this month — 15.2%. Even Rp 500,000 moved on the 1st beats Rp 1,000,000 promised "later".',
  },
  {
    title: 'Cap the three flexible buckets',
    body: 'Groceries, fun and eating out are the only categories that overspent this month (Rp 615,000 over plan combined). Give each a weekly cash envelope: Rp 1,125,000 a week for groceries, Rp 250,000 for fun.',
  },
  {
    title: 'One weekly shop, one list',
    body: 'Four weekly shops cost Rp 4,820,000 this month. Shopping once a week from a written list — and never hungry — typically cuts food spending 10–15% without eating worse.',
  },
  {
    title: 'Review the plan every 1st of the month',
    body: 'Compare planned vs actual for each category, move the leftover to a goal, and reset the plan. A budget that is never reviewed is just a wish list.',
  },
  {
    title: 'Keep the emergency fund boring',
    body: 'Six months of essentials is Rp 30,000,000 for this household; Rp 21,400,000 is saved so far (71%). Keep it in a separate savings account you cannot spend from with one tap.',
  },
  {
    title: 'Small leaks sink budgets',
    body: 'Streaming Rp 180,000, parking & tolls Rp 300,000, pharmacy Rp 210,000 — small lines add up to Rp 690,000. List every subscription once a quarter and cancel the ones nobody used last month.',
  },
];
