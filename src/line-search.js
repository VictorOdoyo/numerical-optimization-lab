import { dot, add } from './vector.js';
import { requireThat } from './validation.js';
export function armijo(
  e,
  x,
  f,
  g,
  d,
  { initial = 1, c1 = 1e-4, shrink = 0.5, maxTrials = 40 } = {},
) {
  const slope = dot(g, d);
  requireThat(slope < 0, 'Line search needs a descent direction', 'DIRECTION');
  requireThat(
    initial > 0 && Number.isFinite(initial) && c1 > 0 && c1 < 1 && shrink > 0 && shrink < 1,
    'Invalid Armijo options',
  );
  let alpha = initial;
  for (let trials = 1; trials <= maxTrials; trials++) {
    const point = add(x, d, alpha);
    let value = Infinity;
    try {
      value = e.f(point);
    } catch (error) {
      if (error.code !== 'NONFINITE') throw error;
    }
    if (value <= f + c1 * alpha * slope)
      return { accepted: true, x: point, f: value, alpha, trials };
    alpha *= shrink;
  }
  return { accepted: false, x: [...x], f, alpha: 0, trials: maxTrials };
}
export function strongWolfe(
  e,
  x,
  f,
  g,
  d,
  { initial = 1, c1 = 1e-4, c2 = 0.9, maxTrials = 50, maxStep = 64 } = {},
) {
  const slope = dot(g, d);
  requireThat(slope < 0 && c1 > 0 && c1 < c2 && c2 < 1, 'Invalid Wolfe direction/options');
  let trials = 0;
  const sample = (a) => {
    trials++;
    const p = add(x, d, a);
    let value;
    try {
      value = e.f(p);
    } catch (error) {
      if (error.code !== 'NONFINITE') throw error;
      return { a, x: p, f: Infinity, s: NaN };
    }
    const grad = e.g(p);
    return { a, x: p, f: value, g: grad, s: dot(grad, d) };
  };
  const accept = (p) => ({ accepted: true, x: p.x, f: p.f, g: p.g, alpha: p.a, trials });
  const zoom = (lo, hi) => {
    while (trials < maxTrials) {
      const p = sample((lo.a + hi.a) / 2);
      if (p.f > f + c1 * p.a * slope || p.f >= lo.f) hi = p;
      else {
        if (Math.abs(p.s) <= -c2 * slope) return accept(p);
        if (p.s * (hi.a - lo.a) >= 0) hi = lo;
        lo = p;
      }
    }
    return null;
  };
  let previous = { a: 0, f, s: slope },
    alpha = initial;
  while (trials < maxTrials) {
    const p = sample(alpha);
    if (p.f > f + c1 * alpha * slope || (previous.a > 0 && p.f >= previous.f)) {
      const r = zoom(previous, p);
      if (r) return r;
      break;
    }
    if (Math.abs(p.s) <= -c2 * slope) return accept(p);
    if (p.s >= 0) {
      const r = zoom(p, previous);
      if (r) return r;
      break;
    }
    previous = p;
    alpha = Math.min(alpha * 2, maxStep);
    if (alpha === previous.a) break;
  }
  return { accepted: false, x: [...x], f, alpha: 0, trials };
}
