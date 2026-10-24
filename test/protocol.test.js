import test from 'node:test';
import assert from 'node:assert/strict';

import { respond } from '../src/protocol.js';
test('worker protocol validates sessions and keeps diagnostic work separate from solver counters', () => {
  const session = { version: 1, problem: 'booth', method: 'bfgs' };
  const r = respond({ id: 7, type: 'solve', session });
  assert(r.ok);
  assert.equal(r.id, 7);
  assert.equal(r.result.result.status, 'converged');
  assert(r.result.diagnostics.stationary);
  assert.equal(respond({ id: 8, type: 'solve', session: { ...session, version: 2 } }).ok, false);
  const s = respond({ id: 9, type: 'surface', session });
  assert.equal(s.result.surface.evaluations, 4225);
});
