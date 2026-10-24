import { dot, norm, add, scale } from './vector.js';
import { matVec } from './matrix.js';
import { requireThat } from './validation.js';
export function boundaryIntersection(p, d, radius) {
  const a = dot(d, d),
    b = 2 * dot(p, d),
    c = dot(p, p) - radius * radius;
  requireThat(a > 0, 'Boundary direction is zero');
  return (-b + Math.sqrt(Math.max(0, b * b - 4 * a * c))) / (2 * a);
}
/** Steihaug truncated CG for the quadratic trust-region subproblem. */
export function steihaug(g, H, radius, { tolerance = 0.1, maxIterations = g.length } = {}) {
  requireThat(radius > 0 && Number.isFinite(radius), 'Trust radius must be positive');
  const apply = typeof H === 'function' ? H : (x) => matVec(H, x);
  let p = g.map(() => 0),
    r = [...g],
    d = scale(g, -1),
    rr = dot(r, r);
  if (norm(g) === 0) return { step: p, reason: 'stationary', iterations: 0 };
  for (let k = 0; k < maxIterations; k++) {
    const Hd = apply(d),
      curvature = dot(d, Hd);
    if (curvature <= 0)
      return {
        step: add(p, d, boundaryIntersection(p, d, radius)),
        reason: 'negative_curvature',
        iterations: k + 1,
      };
    const alpha = rr / curvature,
      next = add(p, d, alpha);
    if (norm(next) >= radius)
      return {
        step: add(p, d, boundaryIntersection(p, d, radius)),
        reason: 'boundary',
        iterations: k + 1,
      };
    p = next;
    r = add(r, Hd, alpha);
    const nextRR = dot(r, r);
    if (Math.sqrt(nextRR) <= tolerance * norm(g))
      return { step: p, reason: 'interior', iterations: k + 1 };
    d = add(scale(r, -1), d, nextRR / rr);
    rr = nextRR;
  }
  return { step: p, reason: 'max_iterations', iterations: maxIterations };
}
