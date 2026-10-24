import test from 'node:test';
import assert from 'node:assert/strict';

import { qr, leastSquares } from '../src/qr.js';
import { matMul, transpose, identity } from '../src/matrix.js';
test('Householder QR is orthogonal and least squares matches an analytical line fit', () => {
  const A = [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ],
    { Q, R } = qr(A),
    I = matMul(transpose(Q), Q),
    B = matMul(Q, R);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) assert(Math.abs(I[i][j] - Number(i === j)) < 1e-14);
    for (let j = 0; j < 2; j++) assert(Math.abs(B[i][j] - A[i][j]) < 1e-14);
  }
  const fit = leastSquares(A, [1, 3, 5, 7]);
  assert(Math.abs(fit[0] - 1) < 1e-14);
  assert(Math.abs(fit[1] - 2) < 1e-14);
  assert.throws(() =>
    leastSquares(
      [
        [1, 2],
        [2, 4],
        [3, 6],
      ],
      [1, 2, 3],
    ),
  );
});
