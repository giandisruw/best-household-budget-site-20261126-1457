// RumahKu Budget — charts drawn as inline SVG, no library and no network.
// Both builders return an SVG string; the caller drops it into the page.

// A donut of spending by category, with a legend and the total in the middle.
export function donutChart(categories, total, size = 220) {
  const radius = 80;
  const inner = 52;
  const cx = size / 2;
  const cy = size / 2;
  let angle = -Math.PI / 2;
  const slices = [];
  const legend = [];
  for (const c of categories) {
    const share = total > 0 ? c.actual / total : 0;
    const sweep = share * Math.PI * 2;
    const large = sweep > Math.PI ? 1 : 0;
    const x1 = cx + radius * Math.cos(angle);
    const y1 = cy + radius * Math.sin(angle);
    const x2 = cx + radius * Math.cos(angle + sweep);
    const y2 = cy + radius * Math.sin(angle + sweep);
    if (share > 0) {
      slices.push(
        `<path d="M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius} ${radius} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${c.color}"/>`,
      );
    }
    angle += sweep;
    legend.push(
      `<li><span class="dot" style="background:${c.color}"></span>${c.name} — ${((share * 100) || 0).toFixed(1).replace('.', ',')}%</li>`,
    );
  }
  const innerCircle = `<circle cx="${cx}" cy="${cy}" r="${inner}" fill="#ffffff"/>`;
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category donut chart">${slices.join('')}${innerCircle}<text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-total">${(total / 1000000).toFixed(2).replace('.', ',')}</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-label">juta spent</text></svg><ul class="legend">${legend.join('')}</ul></div>`;
}

// Grouped bars: income vs spending vs saving for each of the last 6 months.
export function monthBars(months) {
  const width = 640;
  const height = 260;
  const padLeft = 64;
  const padBottom = 30;
  const padTop = 14;
  const max = Math.max(...months.map((m) => m.income)) * 1.08;
  const plotW = width - padLeft - 16;
  const plotH = height - padTop - padBottom;
  const groupW = plotW / months.length;
  const barW = Math.min(22, (groupW - 18) / 3);
  const y = (v) => padTop + plotH - (v / max) * plotH;
  const grid = [0, 5000000, 10000000, 15000000, 20000000]
    .map(
      (v) =>
        `<line x1="${padLeft}" y1="${y(v)}" x2="${width - 16}" y2="${y(v)}" class="grid"/><text x="${padLeft - 8}" y="${y(v) + 4}" text-anchor="end" class="axis">${(v / 1000000).toFixed(0)} jt</text>`,
    )
    .join('');
  const bars = months
    .map((m, i) => {
      const gx = padLeft + i * groupW + (groupW - barW * 3 - 8) / 2;
      const trio = [
        ['#2f6f5e', m.income, 'Income'],
        ['#c98a2e', m.spent, 'Spent'],
        ['#3a6ea5', m.saved, 'Saved'],
      ];
      return trio
        .map(([color, value], k) => {
          const bx = gx + k * (barW + 4);
          return `<rect x="${bx.toFixed(1)}" y="${y(value).toFixed(1)}" width="${barW}" height="${(padTop + plotH - y(value)).toFixed(1)}" fill="${color}"><title>${m.month}: ${value.toLocaleString('id-ID')} — ${['Income', 'Spent', 'Saved'][k]}</title></rect>`;
        })
        .join('') +
        `<text x="${(padLeft + i * groupW + groupW / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" class="axis">${m.month}</text>`;
    })
    .join('');
  const key =
    `<g class="key"><rect x="${padLeft}" y="0" width="12" height="12" fill="#2f6f5e"/><text x="${padLeft + 16}" y="10">Income</text>` +
    `<rect x="${padLeft + 96}" y="0" width="12" height="12" fill="#c98a2e"/><text x="${padLeft + 112}" y="10">Spent</text>` +
    `<rect x="${padLeft + 184}" y="0" width="12" height="12" fill="#3a6ea5"/><text x="${padLeft + 200}" y="10">Saved</text></g>`;
  return `<svg viewBox="0 0 ${width} ${height}" class="bars" role="img" aria-label="Income, spending and saving for the last six months">${key}${grid}${bars}</svg>`;
}

// A thin progress bar (0–100%) used for budgets and savings goals.
export function progressBar(fraction, color = '#2f6f5e') {
  const clamped = Math.max(0, Math.min(1, fraction));
  return `<div class="bar" role="img" aria-label="${Math.round(clamped * 100)} percent"><div class="bar-fill" style="width:${(clamped * 100).toFixed(1)}%;background:${color}"></div></div>`;
}
