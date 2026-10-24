import { requireThat } from './validation.js';
import { dot } from './vector.js';
export function identity(n) {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => Number(i === j)));
}
export function transpose(A) {
  return A[0].map((_, j) => A.map((row) => row[j]));
}
export function matVec(A, x) {
  requireThat(A[0].length === x.length, 'Matrix/vector dimensions differ');
  return A.map((row) => dot(row, x));
}
export function matMul(A, B) {
  requireThat(A[0].length === B.length, 'Matrix dimensions differ');
  const BT = transpose(B);
  return A.map((row) => BT.map((col) => dot(row, col)));
}
export function matAdd(A, B, alpha = 1) {
  requireThat(A.length === B.length && A[0].length === B[0].length, 'Matrix dimensions differ');
  return A.map((r, i) => r.map((v, j) => v + alpha * B[i][j]));
}
export function diagonal(values) {
  return values.map((v, i) => values.map((_, j) => (i === j ? v : 0)));
}
export function symmetric(A, tolerance = 1e-12) {
  if (A.length !== A[0].length) return false;
  for (let i = 0; i < A.length; i++)
    for (let j = 0; j < i; j++)
      if (
        Math.abs(A[i][j] - A[j][i]) >
        tolerance * Math.max(1, Math.abs(A[i][j]), Math.abs(A[j][i]))
      )
        return false;
  return true;
}
