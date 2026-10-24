import { matrix, vector, requireThat } from './validation.js';
import { identity } from './matrix.js';
import { norm } from './vector.js';
/** Householder QR, forming explicit Q for small dense diagnostics. */
export function qr(input) {
  const R = matrix(input),
    m = R.length,
    n = R[0].length,
    Q = identity(m);
  for (let k = 0; k < Math.min(m, n); k++) {
    const x = R.slice(k).map((r) => r[k]),
      length = norm(x);
    if (length === 0) continue;
    const v = [...x];
    v[0] += x[0] >= 0 ? length : -length;
    const vnorm = norm(v);
    for (let i = 0; i < v.length; i++) v[i] /= vnorm;
    for (let j = k; j < n; j++) {
      let d = 0;
      for (let i = k; i < m; i++) d += v[i - k] * R[i][j];
      for (let i = k; i < m; i++) R[i][j] -= 2 * v[i - k] * d;
    }
    for (let i = 0; i < m; i++) {
      let d = 0;
      for (let j = k; j < m; j++) d += Q[i][j] * v[j - k];
      for (let j = k; j < m; j++) Q[i][j] -= 2 * d * v[j - k];
    }
  }
  return { Q, R };
}
export function leastSquares(A, rhs, { tolerance = 1e-12 } = {}) {
  const b = vector(rhs),
    { Q, R } = qr(A),
    m = A.length,
    n = A[0].length;
  requireThat(m >= n && b.length === m, 'Least squares requires rows >= columns and matching RHS');
  const y = Array.from({ length: n }, (_, i) => Q.reduce((sum, row, j) => sum + row[i] * b[j], 0)),
    scale = Math.max(...R.slice(0, n).map((r, i) => Math.abs(r[i])));
  for (let i = n - 1; i >= 0; i--) {
    requireThat(
      Math.abs(R[i][i]) > tolerance * scale,
      'Least-squares matrix is rank deficient',
      'RANK_DEFICIENT',
    );
    for (let j = i + 1; j < n; j++) y[i] -= R[i][j] * y[j];
    y[i] /= R[i][i];
  }
  return y;
}
