import test from 'node:test';
import assert from 'node:assert/strict';
import { lassoADMM } from '../src/admm.js';
test('ADMM honors nonzero initial estimates without changing the certified solution', () => {
  const r = lassoADMM(
    [
      [1, 0],
      [0, 1],
    ],
    [3, -2],
    { lambda: 1, initial: [9, -8], absoluteTolerance: 1e-9, relativeTolerance: 1e-9 },
  );
  assert.equal(r.status, 'converged');
  assert(Math.hypot(r.x[0] - 2, r.x[1] + 1) < 1e-7);
  assert.throws(() =>
    lassoADMM(
      [
        [1, 0],
        [0, 1],
      ],
      [3, -2],
      { initial: [1] },
    ),
  );
});
