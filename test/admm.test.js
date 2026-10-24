import test from 'node:test';
import assert from 'node:assert/strict';

import { lassoADMM } from '../src/admm.js';
import { identity } from '../src/matrix.js';
test('ADMM primal and dual certificates agree with the exact sparse solution', () => {
  const r = lassoADMM(identity(4), [3, -0.4, -2, 0], {
    lambda: 1,
    absoluteTolerance: 1e-9,
    relativeTolerance: 1e-9,
  });
  assert.equal(r.status, 'converged');
  assert(Math.hypot(...r.x.map((v, i) => v - [2, 0, -1, 0][i])) < 1e-7);
  assert(r.primalResidual < 1e-7);
  assert(r.dualResidual < 1e-7);
  assert.equal(lassoADMM(identity(2), [9, 2], { maxIterations: 1 }).status, 'max_iterations');
});
