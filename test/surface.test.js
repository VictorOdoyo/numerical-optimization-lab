import test from 'node:test';
import assert from 'node:assert/strict';

import { sampleSurface } from '../src/surface.js';
test('surface samples respect orientation domains missing values and explicit evaluation accounting', () => {
  const s = sampleSurface(
    { dimension: 2, f: ([x, y]) => x + 10 * y },
    [
      [0, 2],
      [0, 3],
    ],
    { resolution: 8 },
  );
  assert.equal(s.values[0], 0);
  assert.equal(s.values.at(-1), 32);
  assert.equal(s.evaluations, 64);
  assert.equal(s.minimum, 0);
  const q = sampleSurface(
    { dimension: 2, f: ([x]) => (x > 0 ? Infinity : 0) },
    [
      [-1, 1],
      [-1, 1],
    ],
    { resolution: 8 },
  );
  assert.equal(q.finiteCount, 32);
  assert(q.values.includes(null));
});
