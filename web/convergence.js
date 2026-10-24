const NS = 'http://www.w3.org/2000/svg';
const node = (tag, attrs = {}, text) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  if (text !== undefined) n.textContent = text;
  return n;
};
export function convergenceChart(host, rows, minimum) {
  const valid = rows.filter((r) => r.trace?.some((p) => Number.isFinite(p.f)));
  if (!valid.length) {
    host.replaceChildren();
    return;
  }
  const reference =
      minimum ?? Math.min(...valid.flatMap((r) => r.trace.map((p) => p.f).filter(Number.isFinite))),
    points = valid.map((r) =>
      r.trace
        .filter((p) => Number.isFinite(p.f))
        .map((p) => ({
          x: p.iteration,
          y: Math.log10(Math.max(1e-16, Math.abs(p.f - reference))),
        })),
    ),
    maxIteration = Math.max(1, ...points.flatMap((p) => p.map((v) => v.x))),
    lo = Math.floor(Math.min(...points.flatMap((p) => p.map((v) => v.y)))),
    hi = Math.max(lo + 1, Math.ceil(Math.max(...points.flatMap((p) => p.map((v) => v.y))))),
    svg = node('svg', {
      viewBox: '0 0 720 430',
      role: 'img',
      'aria-label': 'Log10 objective gap versus iteration',
    }),
    colors = ['#d99b56', '#3e6c9d', '#75a7a1', '#a292b4'];
  for (let i = 0; i <= 4; i++) {
    const y = 35 + (i / 4) * 325,
      value = hi - (i / 4) * (hi - lo);
    svg.append(
      node('line', { x1: 60, y1: y, x2: 700, y2: y, stroke: '#e6edf5' }),
      node(
        'text',
        { x: 48, y: y + 4, 'text-anchor': 'end', fill: '#8ca0b9', 'font-size': 10 },
        '10^' + value.toFixed(0),
      ),
      node(
        'text',
        {
          x: 60 + (i / 4) * 640,
          y: 384,
          'text-anchor': 'middle',
          fill: '#8ca0b9',
          'font-size': 10,
        },
        String(Math.round((maxIteration * i) / 4)),
      ),
    );
  }
  points.forEach((line, index) => {
    const d = line
      .map(
        (p, i) =>
          (i ? 'L' : 'M') +
          (60 + (p.x / maxIteration) * 640).toFixed(2) +
          ' ' +
          (35 + ((hi - p.y) / (hi - lo)) * 325).toFixed(2),
      )
      .join(' ');
    svg.append(
      node('path', { d, stroke: colors[index % colors.length], fill: 'none', 'stroke-width': 2 }),
    );
    svg.append(
      node(
        'text',
        { x: 65 + index * 150, y: 410, fill: colors[index % colors.length], 'font-size': 11 },
        valid[index].method,
      ),
    );
  });
  host.replaceChildren(svg);
  document.getElementById('chart-note').textContent =
    'Logarithmic objective gap to ' +
    (minimum === undefined ? 'the lowest observed trace value' : 'the known benchmark reference') +
    '. Plot values are clipped at 10^-16; this is not an optimality certificate.';
}
