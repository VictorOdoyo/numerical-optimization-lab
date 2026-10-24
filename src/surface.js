import { integer, requireThat } from './validation.js';
export function sampleSurface(problem, domain, { resolution = 65 } = {}) {
  requireThat(problem.dimension === 2, 'Surface sampling requires two dimensions');
  integer(resolution, 'resolution', 8, 150);
  requireThat(
    Array.isArray(domain) &&
      domain.length === 2 &&
      domain.every((r) => r.length === 2 && r.every(Number.isFinite) && r[0] < r[1]),
    'Invalid surface domain',
  );
  const values = [],
    xs = Array.from(
      { length: resolution },
      (_, i) => domain[0][0] + (i / (resolution - 1)) * (domain[0][1] - domain[0][0]),
    ),
    ys = Array.from(
      { length: resolution },
      (_, i) => domain[1][0] + (i / (resolution - 1)) * (domain[1][1] - domain[1][0]),
    );
  let minimum = Infinity,
    maximum = -Infinity,
    finiteCount = 0;
  for (const y of ys)
    for (const x of xs) {
      let value;
      try {
        value = problem.f([x, y]);
      } catch {
        value = NaN;
      }
      if (Number.isFinite(value)) {
        minimum = Math.min(minimum, value);
        maximum = Math.max(maximum, value);
        finiteCount++;
      }
      values.push(Number.isFinite(value) ? value : null);
    }
  return {
    resolution,
    domain: domain.map((r) => [...r]),
    xs,
    ys,
    values,
    minimum: finiteCount ? minimum : null,
    maximum: finiteCount ? maximum : null,
    evaluations: resolution * resolution,
    finiteCount,
  };
}
