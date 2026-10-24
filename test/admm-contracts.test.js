import test from 'node:test';
import assert from 'node:assert/strict';
import { lassoADMM } from '../src/admm.js';
test('ADMM rejects infinite tolerances and penalties rather than issuing false certificates', () => {
  for (const options of [
    { absoluteTolerance: Infinity },
    { relativeTolerance: 0 },
    { lambda: Infinity },
  ])
    assert.throws(() => lassoADMM([[1]], [2], options));
});
