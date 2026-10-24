import test from 'node:test';
import assert from 'node:assert/strict';

import { cholesky, choleskySolve } from '../src/cholesky.js';
import { matMul, transpose } from '../src/matrix.js';
import { relativeResidual } from '../src/lu.js';
test('Cholesky reconstructs SPD matrices and rejects indefinite curvature', () => {
  const A = [
      [4, 2, 0],
      [2, 5, 1],
      [0, 1, 3],
    ],
    L = cholesky(A);
  const rebuilt = matMul(L, transpose(L));
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) assert(Math.abs(rebuilt[i][j] - A[i][j]) < 1e-14);
  assert(relativeResidual(A, choleskySolve(L, [1, 2, 3]), [1, 2, 3]) < 1e-14);
  assert.throws(() =>
    cholesky([
      [1, 2],
      [2, 1],
    ]),
  );
  assert(
    cholesky(
      [
        [1, 2],
        [2, 1],
      ],
      { shift: 2 },
    ),
  );
});
