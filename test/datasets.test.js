import test from 'node:test';
import assert from 'node:assert/strict';

import { regressionData, decayData } from '../src/datasets.js';
import { matMul, transpose } from '../src/matrix.js';
import { eigenSymmetric } from '../src/eigen.js';
test('seeded regression designs have the requested singular-value spectrum', () => {
  const d = regressionData({ rows: 20, columns: 4, condition: 100, noise: 0, seed: 7 }),
    e = eigenSymmetric(matMul(transpose(d.A), d.A));
  assert(Math.abs(Math.sqrt(e.values.at(-1) / e.values[0]) - 100) < 1e-7);
  assert.deepEqual(d, regressionData({ rows: 20, columns: 4, condition: 100, noise: 0, seed: 7 }));
  assert.deepEqual(d.b, d.clean);
  assert.deepEqual(decayData({ seed: 9 }), decayData({ seed: 9 }));
});
