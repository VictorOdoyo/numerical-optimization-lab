import test from 'node:test';
import assert from 'node:assert/strict';

import { luFactor, luSolve, solve, relativeResidual } from '../src/lu.js';
test('scaled pivoting solves row-swapped and severely rescaled systems', () => {
  const A = [
      [0, 2, 1],
      [3, -1, 2],
      [1, 1, 1],
    ],
    b = [7, 7, 6],
    x = solve(A, b);
  assert(relativeResidual(A, x, b) < 1e-14);
  const S = A.map((r, i) => r.map((v) => v * [1e-9, 1e8, 1][i])),
    rhs = b.map((v, i) => v * [1e-9, 1e8, 1][i]);
  assert(relativeResidual(S, luSolve(luFactor(S), rhs), rhs) < 1e-14);
  assert.throws(
    () =>
      solve(
        [
          [1, 2],
          [2, 4],
        ],
        [1, 2],
      ),
    (e) => e.code === 'SINGULAR',
  );
});
