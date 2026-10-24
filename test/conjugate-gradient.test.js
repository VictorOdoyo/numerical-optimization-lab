import test from 'node:test';
import assert from 'node:assert/strict';

import { conjugateGradient } from '../src/conjugate-gradient.js';
import { relativeResidual } from '../src/lu.js';
test('matrix-free PCG solves SPD systems and reports negative curvature explicitly', () => {
  const A = [
      [4, 1, 0],
      [1, 3, 1],
      [0, 1, 2],
    ],
    b = [1, 2, 3],
    r = conjugateGradient(A, b);
  assert.equal(r.status, 'converged');
  assert(relativeResidual(A, r.x, b) < 1e-10);
  const d = [1, 100, 10000],
    p = conjugateGradient((x) => x.map((v, i) => d[i] * v), [1, 1, 1], {
      preconditioner: (r) => r.map((v, i) => v / d[i]),
    });
  assert.equal(p.iterations, 1);
  assert.equal(
    conjugateGradient(
      [
        [-1, 0],
        [0, -2],
      ],
      [1, 1],
    ).status,
    'indefinite',
  );
});
