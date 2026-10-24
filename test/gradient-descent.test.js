import test from 'node:test';
import assert from 'node:assert/strict';

import { gradientDescent } from '../src/gradient-descent.js';
import { quadratic } from './problems.js';
test('backtracking gradient descent reaches the analytical minimizer with monotone objective', () => {
  const r = gradientDescent(quadratic, [-4, 6], { gtol: 1e-7 });
  assert.equal(r.status, 'converged');
  assert(Math.hypot(r.x[0] - 3, r.x[1] + 2) < 1e-6);
  for (let i = 1; i < r.trace.length; i++) assert(r.trace[i].f <= r.trace[i - 1].f);
  const b = gradientDescent(quadratic, [-4, 6], { maxIterations: 1 });
  assert.equal(b.status, 'max_iterations');
});
