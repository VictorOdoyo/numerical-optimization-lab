import test from 'node:test';
import assert from 'node:assert/strict';

import { modifiedNewton } from '../src/newton.js';
import { quadratic, rosenbrock } from './problems.js';
test('modified Newton solves quadratics in one step and nonlinear valleys with safeguards', () => {
  const a = modifiedNewton(quadratic, [-4, 8]);
  assert.equal(a.status, 'converged');
  assert.equal(a.iterations, 1);
  const r = modifiedNewton(rosenbrock, [-1.2, 1], { gtol: 1e-7 });
  assert.equal(r.status, 'converged');
  assert(r.f < 1e-12);
});
