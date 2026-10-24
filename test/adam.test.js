import test from 'node:test';
import assert from 'node:assert/strict';

import { adam } from '../src/adam.js';
import { quadratic } from './problems.js';
test('bias-corrected deterministic Adam reaches the reference minimum and reports finite budgets', () => {
  const r = adam(quadratic, [0, 0], { maxIterations: 2000, gtol: 1e-6 });
  assert.equal(r.status, 'converged');
  assert(r.f < 1e-10);
  assert.equal(adam(quadratic, [0, 0], { maxIterations: 2 }).status, 'max_iterations');
  assert.throws(() => adam(quadratic, [0, 0], { beta2: 1 }));
});
