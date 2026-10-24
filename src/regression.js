import { matrix, vector, requireThat } from './validation.js';
import { transpose, matMul, matVec } from './matrix.js';
import { dot, add } from './vector.js';
export function ridgeProblem(input, targets, { lambda = 0 } = {}) {
  const A = matrix(input),
    b = vector(targets),
    m = A.length,
    n = A[0].length;
  requireThat(
    b.length === m && lambda >= 0 && Number.isFinite(lambda),
    'Invalid regression data or penalty',
  );
  const AT = transpose(A),
    gram = matMul(AT, A).map((row, i) => row.map((v, j) => v / m + (i === j ? lambda : 0)));
  return {
    dimension: n,
    f: (x) => {
      const r = add(matVec(A, x), b, -1);
      return (0.5 * dot(r, r)) / m + 0.5 * lambda * dot(x, x);
    },
    g: (x) =>
      add(
        matVec(AT, add(matVec(A, x), b, -1)).map((v) => v / m),
        x,
        lambda,
      ),
    H: () => gram.map((row) => [...row]),
  };
}
export function logisticProblem(input, targets, { lambda = 0.1 } = {}) {
  const X = matrix(input),
    y = vector(targets),
    m = X.length,
    n = X[0].length;
  requireThat(
    y.length === m && y.every((v) => v === 0 || v === 1) && lambda >= 0 && Number.isFinite(lambda),
    'Binary labels and nonnegative penalty required',
  );
  const sigmoid = (z) => (z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z)));
  return {
    dimension: n,
    f: (w) =>
      X.reduce(
        (sum, row, i) => {
          const z = dot(row, w);
          return sum + (Math.max(0, z) - y[i] * z + Math.log1p(Math.exp(-Math.abs(z)))) / m;
        },
        0.5 * lambda * dot(w, w),
      ),
    g: (w) =>
      w.map(
        (v, j) =>
          lambda * v +
          X.reduce((sum, row, i) => sum + ((sigmoid(dot(row, w)) - y[i]) * row[j]) / m, 0),
      ),
    H: (w) =>
      Array.from({ length: n }, (_, j) =>
        Array.from({ length: n }, (_, k) =>
          X.reduce(
            (sum, row) => {
              const p = sigmoid(dot(row, w));
              return sum + (p * (1 - p) * row[j] * row[k]) / m;
            },
            j === k ? lambda : 0,
          ),
        ),
      ),
  };
}
