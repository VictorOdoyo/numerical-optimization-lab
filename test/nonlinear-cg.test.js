import test from 'node:test';
import assert from 'node:assert/strict';

import { nonlinearCG } from '../src/nonlinear-cg.js';
import { quadratic, rosenbrock } from './problems.js';
test('PR-plus nonlinear CG restarts and reaches analytical stationary points', () => {
  for (const [p, x] of [
    [quadratic, [-4, 8]],
    [rosenbrock, [-1.2, 1]],
  ]) {
    const r = nonlinearCG(p, x, { maxIterations: 2000, gtol: 1e-6 });
    assert.equal(r.status, 'converged');
    assert(r.f < 1e-9);
    assert(r.trace.some((t) => t.beta === 0));
  }
});
