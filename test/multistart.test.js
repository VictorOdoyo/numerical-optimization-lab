import test from 'node:test';
import assert from 'node:assert/strict';

import { multiStart } from '../src/multistart.js';
import { createCase } from '../src/catalog.js';
test('seeded multistart replays starting points and reports observed rather than guaranteed optima', () => {
  const c = createCase('himmelblau'),
    a = multiStart(c, 'bfgs', { runs: 5, seed: 17 }),
    b = multiStart(c, 'bfgs', { runs: 5, seed: 17 });
  assert.deepEqual(
    a.runs.map((r) => r.start),
    b.runs.map((r) => r.start),
  );
  assert(a.best.f < 1e-10);
  assert.equal(a.runs.length, 5);
  assert(a.statement.includes('no global'));
});
