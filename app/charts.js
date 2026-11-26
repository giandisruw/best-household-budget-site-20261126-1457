// RumahKu Budget — charts drawn on canvas, no library.
//
// Two charts, both drawn with plain canvas 2D so the site needs no
// framework and no network: a donut of where the money went, and grouped
// bars of income, spending and saving across six months.

import { formatRupiah, formatShort } from "./format.js";

function setupCanvas(canvas, height) {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 320;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.height = height + "px";
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width, height };
}

export function drawDonut(canvas, categories, spentTotal) {
  const { ctx, width, height } = setupCanvas(canvas, 260);
  const centreX = width * 0.32;
  const centreY = height / 2;
  const outer = Math.min(width * 0.3, 105);
  const inner = outer * 0.62;
  const total = spentTotal || 1;
  let angle = -Math.PI / 2;

  ctx.clearRect(0, 0, width, height);
  for (const category of categories) {
    const slice = (category.spent / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(centreX, centreY);
    ctx.arc(centreX, centreY, outer, angle, angle + slice);
    ctx.closePath();
    ctx.fillStyle = category.color;
    ctx.fill();
    angle += slice;
  }
  ctx.beginPath();
  ctx.arc(centreX, centreY, inner, 0, Math.PI * 2);
  ctx.fillStyle = "#fffdf6";
  ctx.fill();

  ctx.fillStyle = "#22312b";
  ctx.font = "700 22px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(formatShort(spentTotal).replace("Rp ", ""), centreX, centreY - 10);
  ctx.fillStyle = "#6b7280";
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText("juta spent", centreX, centreY + 14);

  // Legend, drawn to the right of the ring.
  const legendX = width * 0.62;
  let legendY = 34;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  for (const category of categories) {
    const share = (category.spent / total) * 100;
    ctx.fillStyle = category.color;
    ctx.beginPath();
    ctx.arc(legendX + 6, legendY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#22312b";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText(category.label + " — " + share.toFixed(1).replace(".", ",") + "%", legendX + 18, legendY);
    legendY += 26;
  }
}

export function drawMonthBars(canvas, months) {
  const { ctx, width, height } = setupCanvas(canvas, 240);
  const padLeft = 46;
  const padBottom = 30;
  const padTop = 16;
  const plotWidth = width - padLeft - 12;
  const plotHeight = height - padTop - padBottom;
  const maxValue = Math.max(...months.map((month) => month.income)) * 1.08;

  ctx.clearRect(0, 0, width, height);
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = "#6b7280";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let step = 0; step <= 4; step++) {
    const value = (maxValue / 4) * step;
    const y = padTop + plotHeight - (value / maxValue) * plotHeight;
    ctx.strokeStyle = "#e7dfc9";
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(width - 12, y);
    ctx.stroke();
    ctx.fillText((value / 1000000).toFixed(0) + " jt", padLeft - 6, y);
  }

  const groupWidth = plotWidth / months.length;
  const barWidth = Math.min(16, groupWidth / 4.5);
  const series = [
    { key: "income", color: "#2e6b57", label: "Income" },
    { key: "spent", color: "#c08a1e", label: "Spent" },
    { key: "saved", color: "#2f5d8a", label: "Saved" },
  ];

  months.forEach((month, index) => {
    const groupX = padLeft + index * groupWidth + groupWidth / 2;
    series.forEach((item, seriesIndex) => {
      const value = item.key === "saved" ? month.income - month.spent : month[item.key];
      const barHeight = (value / maxValue) * plotHeight;
      const x = groupX - (series.length * barWidth) / 2 + seriesIndex * barWidth;
      ctx.fillStyle = item.color;
      ctx.fillRect(x, padTop + plotHeight - barHeight, barWidth - 2, barHeight);
    });
    ctx.fillStyle = "#22312b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(month.label, groupX, height - 22);
  });

  // Legend above the plot.
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  let legendX = padLeft;
  for (const item of series) {
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, 4, 10, 10);
    ctx.fillStyle = "#22312b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText(item.label, legendX + 15, 9);
    legendX += 15 + ctx.measureText(item.label).width + 22;
  }
}

export function moneyLeftCaption(income, spent, plannedSaving) {
  const left = income - spent;
  const rate = income > 0 ? (left / income) * 100 : 0;
  return {
    left,
    rate,
    text: formatRupiah(left) + " left · " + rate.toFixed(1).replace(".", ",") + "% of income",
    planText: "Plan: save " + formatRupiah(plannedSaving),
  };
}
