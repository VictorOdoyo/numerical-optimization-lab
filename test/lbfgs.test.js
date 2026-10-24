import test from 'node:test';
import assert from 'node:assert/strict';

import { lbfgs, twoLoop } from '../src/lbfgs.js';
import { rosenbrock } from './problems.js';
test('limited-memory recursion is bounded and converges from the standard Rosenbrock start', () => {
  assert.deepEqual(twoLoop([2, -3], []), [-2, 3]);
  const r = lbfgs(rosenbrock, [-1.2, 1], { memory: 5, gtol: 1e-7 });
  assert.equal(r.status, 'converged');
  assert(r.f < 1e-12);
  assert(r.trace.every((t) => (t.historySize ?? 0) <= 5));
});
