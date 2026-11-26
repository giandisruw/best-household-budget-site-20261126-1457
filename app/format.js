// RumahKu Budget — formatting helpers.
//
// One place for every number the site shows, so "Rp 3.270.000" looks the
// same on the dashboard, in the budget table and in the expense list.
// Indonesian number style: dots for thousands, comma for decimals.

export function formatRupiah(amount) {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const digits = String(Math.abs(rounded)).split("");
  const grouped = [];
  while (digits.length > 3) grouped.unshift(digits.splice(-3).join(""));
  grouped.unshift(digits.join(""));
  return sign + "Rp " + grouped.join(".");
}

export function formatShort(amount) {
  // "Rp 18,23 jt" — the compact form used inside the donut chart.
  const millions = amount / 1000000;
  const text = millions.toFixed(2).replace(".", ",");
  return "Rp " + text + " jt";
}

export function formatPercent(value, decimals = 1) {
  return value.toFixed(decimals).replace(".", ",") + "%";
}

export function formatDate(isoDate) {
  const parts = isoDate.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  return day + " " + monthNames[month - 1] + " " + year;
}

export function parseAmount(raw) {
  // Accepts "1.250.000", "1250000" or "Rp 1.250.000" and returns a number.
  if (typeof raw === "number") return raw;
  const cleaned = String(raw).replace(/[^0-9-]/g, "");
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
}

export function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
