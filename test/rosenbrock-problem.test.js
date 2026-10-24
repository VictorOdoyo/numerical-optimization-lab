import test from 'node:test';
import assert from 'node:assert/strict';

import { rosenbrockProblem } from '../src/rosenbrock-problem.js';
import { checkGradient, finiteHessian } from '../src/differences.js';
test('n-dimensional Rosenbrock derivatives match independent numerical curvature', () => {
  const p = rosenbrockProblem(5),
    x = [-0.7, 0.3, 1.2, -1, 0.9],
    H = p.H(x),
    numeric = finiteHessian(p.f, x, { gradient: p.g });
  assert(checkGradient(p, x).relativeError < 1e-8);
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < 5; j++) assert(Math.abs(H[i][j] - numeric[i][j]) < 1e-6);
  assert.equal(p.f(Array(5).fill(1)), 0);
});
