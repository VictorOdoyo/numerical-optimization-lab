import test from 'node:test';
import assert from 'node:assert/strict';

import { bfgs, inverseBfgs } from '../src/bfgs.js';
import { quadratic, rosenbrock } from './problems.js';
import { matVec, identity } from '../src/matrix.js';
test('inverse BFGS satisfies the secant equation and solves Rosenbrock', () => {
  const s = [1, 2],
    y = [2, 5],
    H = inverseBfgs(identity(2), s, y),
    Hy = matVec(H, y);
  assert(Math.hypot(...Hy.map((v, i) => v - s[i])) < 1e-12);
  assert.equal(inverseBfgs(identity(2), [1, 0], [-1, 0]), null);
  const r = bfgs(rosenbrock, [-1.2, 1], { gtol: 1e-7 });
  assert.equal(r.status, 'converged');
  assert(r.f < 1e-12);
  assert(Math.hypot(r.x[0] - 1, r.x[1] - 1) < 1e-5);
});
