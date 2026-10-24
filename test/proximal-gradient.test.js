import test from 'node:test';
import assert from 'node:assert/strict';

import { proximalGradient, fista } from '../src/proximal-gradient.js';
test('ISTA and restarted FISTA match the exact soft-threshold solution', () => {
  const target = [3, -0.4, -2, 0],
    problem = {
      dimension: 4,
      f: (x) => 0.5 * x.reduce((s, v, i) => s + (v - target[i]) ** 2, 0),
      g: (x) => x.map((v, i) => v - target[i]),
    };
  for (const solver of [proximalGradient, fista]) {
    const r = solver(problem, [0, 0, 0, 0], { lambda: 1, gtol: 1e-9 });
    assert.equal(r.status, 'converged');
    assert(Math.hypot(...r.x.map((v, i) => v - [2, 0, -1, 0][i])) < 1e-8);
    assert(r.gradientNorm < 1e-9);
  }
});
