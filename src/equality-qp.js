import { matrix, vector, requireThat } from './validation.js';
import { symmetric, matVec, transpose } from './matrix.js';
import { cholesky } from './cholesky.js';
import { solve } from './lu.js';
import { add, norm, dot } from './vector.js';
export function equalityQP(Qinput, cInput, Ainput, bInput) {
  const Q = matrix(Qinput),
    c = vector(cInput),
    A = matrix(Ainput),
    b = vector(bInput),
    n = c.length,
    m = b.length;
  requireThat(
    Q.length === n &&
      Q[0].length === n &&
      A.length === m &&
      A[0].length === n &&
      n + m <= 256 &&
      symmetric(Q),
    'Invalid equality QP dimensions',
  );
  cholesky(Q);
  const K = Array.from({ length: n + m }, (_, i) =>
      Array.from({ length: n + m }, (_, j) =>
        i < n && j < n ? Q[i][j] : i < n ? A[j - n][i] : j < n ? A[i - n][j] : 0,
      ),
    ),
    solution = solve(K, [...c.map((v) => -v), ...b]),
    x = solution.slice(0, n),
    multipliers = solution.slice(n),
    primalResidual = norm(add(matVec(A, x), b, -1)),
    dualResidual = norm(add(add(matVec(Q, x), c), matVec(transpose(A), multipliers)));
  return {
    x,
    multipliers,
    f: 0.5 * dot(x, matVec(Q, x)) + dot(c, x),
    status: 'solved',
    primalResidual,
    dualResidual,
  };
}
