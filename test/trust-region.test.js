import test from 'node:test';
import assert from 'node:assert/strict';

import { trustRegion } from '../src/trust-region.js';
import { quadratic, rosenbrock } from './problems.js';
test('trust-region acceptance follows model agreement and solves the Rosenbrock valley', () => {
  for (const [p, x] of [
    [quadratic, [-4, 8]],
    [rosenbrock, [-1.2, 1]],
  ]) {
    const r = trustRegion(p, x, { gtol: 1e-7 });
    assert.equal(r.status, 'converged');
    assert(r.f < 1e-12);
    for (let i = 1; i < r.trace.length; i++) assert(r.trace[i].f <= r.trace[i - 1].f);
    assert(r.trace.every((t) => (t.radius ?? 1) > 0));
  }
});
