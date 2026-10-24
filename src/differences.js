import { vector, requireThat } from './validation.js';
import { norm, add } from './vector.js';
export function finiteGradient(f, point, { step = Math.cbrt(Number.EPSILON) } = {}) {
  const x = vector(point);
  requireThat(step > 0 && Number.isFinite(step), 'Difference step must be positive');
  return x.map((v, i) => {
    const h = step * Math.max(1, Math.abs(v)),
      a = [...x],
      b = [...x];
    a[i] += h;
    b[i] -= h;
    return (f(a) - f(b)) / (a[i] - b[i]);
  });
}
export function finiteJacobian(f, point, { step = Math.cbrt(Number.EPSILON) } = {}) {
  const x = vector(point),
    base = vector(f(x)),
    J = base.map(() => Array(x.length).fill(0));
  for (let j = 0; j < x.length; j++) {
    const h = step * Math.max(1, Math.abs(x[j])),
      a = [...x],
      b = [...x];
    a[j] += h;
    b[j] -= h;
    const u = vector(f(a)),
      v = vector(f(b));
    requireThat(
      u.length === base.length && v.length === base.length,
      'Residual dimensions changed',
    );
    for (let i = 0; i < base.length; i++) J[i][j] = (u[i] - v[i]) / (a[j] - b[j]);
  }
  return J;
}
export function finiteHessian(f, x, { gradient } = {}) {
  if (gradient) {
    const J = finiteJacobian(gradient, x);
    return J.map((r, i) => r.map((v, j) => (v + J[j][i]) / 2));
  }
  const point = vector(x),
    n = point.length,
    H = Array.from({ length: n }, () => Array(n).fill(0)),
    h = point.map((v) => Number.EPSILON ** 0.25 * Math.max(1, Math.abs(v))),
    base = f([...point]);
  for (let i = 0; i < n; i++)
    for (let j = 0; j <= i; j++) {
      if (i === j) {
        const a = [...point],
          b = [...point];
        a[i] += h[i];
        b[i] -= h[i];
        H[i][i] = (f(a) - 2 * base + f(b)) / (h[i] * h[i]);
      } else {
        let sum = 0;
        for (const si of [-1, 1])
          for (const sj of [-1, 1]) {
            const a = [...point];
            a[i] += si * h[i];
            a[j] += sj * h[j];
            sum += si * sj * f(a);
          }
        H[i][j] = H[j][i] = sum / (4 * h[i] * h[j]);
      }
    }
  return H;
}
export function checkGradient(problem, x) {
  const analytic = vector(problem.g([...x])),
    numeric = finiteGradient((v) => problem.f(v), x);
  return {
    analytic,
    numeric,
    relativeError: norm(add(analytic, numeric, -1)) / Math.max(1, norm(analytic), norm(numeric)),
  };
}
