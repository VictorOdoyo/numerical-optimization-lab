import test from 'node:test';
import assert from 'node:assert/strict';

import { projectedGradient } from '../src/projected-gradient.js';
import { quadratic } from './problems.js';
test('box constraints converge at active bounds despite a nonzero raw gradient', () => {
  const r = projectedGradient(quadratic, [-5, 9], { lower: [0, -1], upper: [2, 4], gtol: 1e-8 });
  assert.equal(r.status, 'converged');
  assert(Math.hypot(r.x[0] - 2, r.x[1] + 1) < 1e-8);
  assert(r.gradientNorm > 1);
  assert(r.optimalityResidual < 1e-8);
  assert(r.trace.every((t) => t.x[0] >= 0 && t.x[0] <= 2 && t.x[1] >= -1 && t.x[1] <= 4));
});
