import test from 'node:test';
import assert from 'node:assert/strict';

import { compareMethods, sweep } from '../src/comparison.js';
import { createCase } from '../src/catalog.js';
test('method comparisons isolate unsupported combinations and preserve equal starts', () => {
  const rows = compareMethods('booth', ['bfgs', 'trust', 'projected']);
  assert(rows.slice(0, 2).every((r) => r.status === 'converged'));
  assert.equal(rows[2].status, 'unsupported');
  assert.deepEqual(rows[0].trace[0].x, rows[1].trace[0].x);
  const s = sweep(createCase('booth'), 'gradient', [1, 3], { parameter: 'maxIterations' });
  assert(s[0].result.iterations <= 1 && s[1].result.iterations <= 3);
});
