import test from 'node:test';
import assert from 'node:assert/strict';

import {
  finiteGradient,
  finiteHessian,
  finiteJacobian,
  checkGradient,
} from '../src/differences.js';
test('central derivatives recover cross curvature and expose wrong analytical gradients', () => {
  const f = ([x, y]) => 3 * x * x + 2 * x * y + 4 * y * y + Math.sin(x),
    g = ([x, y]) => [6 * x + 2 * y + Math.cos(x), 2 * x + 8 * y],
    x = [0.4, -0.7],
    a = finiteGradient(f, x);
  assert(Math.hypot(...a.map((v, i) => v - g(x)[i])) < 1e-8);
  const H = finiteHessian(f, x, { gradient: g });
  assert(Math.abs(H[0][0] - (6 - Math.sin(0.4))) < 1e-8);
  assert(Math.abs(H[0][1] - 2) < 1e-8);
  assert(checkGradient({ f, g }, x).relativeError < 1e-9);
  assert(checkGradient({ f, g: () => [0, 0] }, x).relativeError > 0.5);
  assert.deepEqual(
    finiteJacobian(([x, y]) => [x + 2 * y, 3 * x - y], [0, 0]).map((r) => r.map(Math.round)),
    [
      [1, 2],
      [3, -1],
    ],
  );
});
