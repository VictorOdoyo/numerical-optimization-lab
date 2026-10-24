import { vector, requireThat } from './validation.js';
import { matVec } from './matrix.js';
import { dot, norm, add } from './vector.js';
export function conjugateGradient(
  A,
  rhs,
  { x0, tolerance = 1e-10, maxIterations = rhs.length * 4, preconditioner = (r) => [...r] } = {},
) {
  const b = vector(rhs),
    apply = typeof A === 'function' ? A : (x) => matVec(A, x);
  let x = x0 ? vector(x0) : b.map(() => 0),
    r = add(b, apply(x), -1),
    z = preconditioner(r),
    p = [...z],
    rz = dot(r, z),
    iterations = 0;
  const target = tolerance * Math.max(1, norm(b));
  if (norm(r) <= target) return { x, status: 'converged', iterations, residual: norm(r) };
  for (; iterations < maxIterations; iterations++) {
    const Ap = apply(p),
      curvature = dot(p, Ap);
    if (!(curvature > 0) || !(rz > 0))
      return { x, status: 'indefinite', iterations, residual: norm(r) };
    const alpha = rz / curvature;
    x = add(x, p, alpha);
    r = add(r, Ap, -alpha);
    if (norm(r) <= target)
      return { x, status: 'converged', iterations: iterations + 1, residual: norm(r) };
    z = preconditioner(r);
    const next = dot(r, z);
    p = add(z, p, next / rz);
    rz = next;
  }
  return { x, status: 'max_iterations', iterations, residual: norm(r) };
}
