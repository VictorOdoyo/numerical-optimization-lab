import test from 'node:test';
import assert from 'node:assert/strict';

import {
  boxProject,
  simplexProject,
  l1Project,
  l2Project,
  softThreshold,
} from '../src/projections.js';
test('projections satisfy independent KKT threshold and radius conditions', () => {
  const x = [0.2, -1, 3, 2],
    p = simplexProject(x, 2);
  assert(p.every((v) => v >= 0));
  assert(Math.abs(p.reduce((a, b) => a + b) - 2) < 1e-12);
  const active = p.map((v, i) => (v > 0 ? x[i] - v : null)).filter((v) => v !== null);
  assert(active.every((v) => Math.abs(v - active[0]) < 1e-12));
  assert.deepEqual(boxProject([-3, 5], [0, 1], [2, 4]), [0, 4]);
  assert(Math.abs(l1Project(x, 1).reduce((s, v) => s + Math.abs(v), 0) - 1) < 1e-12);
  assert(Math.abs(Math.hypot(...l2Project([3, 4], 2)) - 2) < 1e-12);
  assert.deepEqual(softThreshold([-3, 1, 4], 2), [-1, 0, 2]);
});
