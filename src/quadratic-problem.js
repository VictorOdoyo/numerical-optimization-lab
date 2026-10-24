import { matrix, vector, requireThat } from './validation.js';
import { symmetric, matVec } from './matrix.js';
import { dot, add } from './vector.js';
export function quadraticProblem(input, linear, { constant = 0 } = {}) {
  const Q = matrix(input),
    c = vector(linear);
  requireThat(
    Q.length === c.length && Q[0].length === c.length && symmetric(Q),
    'Quadratic requires matching symmetric curvature',
  );
  return {
    dimension: c.length,
    Q,
    c,
    f: (x) => 0.5 * dot(x, matVec(Q, x)) + dot(c, x) + constant,
    g: (x) => add(matVec(Q, x), c),
    H: () => Q.map((r) => [...r]),
  };
}
