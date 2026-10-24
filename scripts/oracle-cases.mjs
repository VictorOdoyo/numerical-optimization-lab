import {
  bfgs,
  lbfgs,
  modifiedNewton,
  trustRegion,
  rosenbrockProblem,
  regressionData,
  lassoADMM,
  activeSetQP,
  equalityQP,
  solve,
  leastSquares,
  eigenSymmetric,
  matMul,
  transpose,
  quadraticProblem,
  random,
  normal,
} from '../src/index.js';
const result = [],
  summary = (r) => ({ x: r.x, f: r.f, status: r.status });
for (const [name, solver] of Object.entries({
  bfgs,
  lbfgs,
  newton: modifiedNewton,
  trust: trustRegion,
}))
  result.push({
    type: 'rosenbrock',
    name,
    result: summary(solver(rosenbrockProblem(), [-1.2, 1], { gtol: 1e-7 })),
  });
const rng = normal(random(312));
for (let seed = 0; seed < 5; seed++) {
  const M = Array.from({ length: 5 }, () => Array.from({ length: 5 }, rng)),
    Q = matMul(transpose(M), M).map((r, i) => r.map((v, j) => v + Number(i === j))),
    c = Array.from({ length: 5 }, rng),
    p = quadraticProblem(Q, c);
  result.push({
    type: 'quadratic',
    Q,
    c,
    result: summary(bfgs(p, Array(5).fill(0), { gtol: 1e-7 })),
  });
}
const d = regressionData({ rows: 20, columns: 3, noise: 0.01, seed: 23 });
result.push({ type: 'least-squares', A: d.A, b: d.b, x: leastSquares(d.A, d.b) });
result.push({
  type: 'lasso',
  A: d.A,
  b: d.b,
  lambda: 0.05,
  result: summary(
    lassoADMM(d.A, d.b, { lambda: 0.05, absoluteTolerance: 1e-9, relativeTolerance: 1e-9 }),
  ),
});
const Q = [
    [4, 1, 0],
    [1, 3, 0.2],
    [0, 0.2, 2],
  ],
  c = [-4, -3, -2],
  G = [
    [1, 1, 1],
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
  ],
  h = [1.2, 0, 0, 0];
result.push({
  type: 'inequality',
  Q,
  c,
  G,
  h,
  result: summary(activeSetQP(Q, c, G, h, [0, 0, 0])),
});
result.push({
  type: 'equality',
  Q,
  c,
  A: [[1, 1, 1]],
  b: [1],
  result: summary(equalityQP(Q, c, [[1, 1, 1]], [1])),
});
result.push({ type: 'eigen', A: Q, result: eigenSymmetric(Q) });
console.log(JSON.stringify(result));
