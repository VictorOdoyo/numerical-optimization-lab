import { rosenbrockProblem } from './rosenbrock-problem.js';
import { himmelblau, rastrigin, beale, booth } from './landscapes.js';
import { quadraticProblem } from './quadratic-problem.js';
import { regressionData, decayData } from './datasets.js';
import { ridgeProblem } from './regression.js';
import { leastSquaresProblem } from './least-squares.js';
import { requireThat } from './validation.js';
export const CATALOG = [
  {
    id: 'rosenbrock',
    label: 'Rosenbrock valley',
    task: 'smooth',
    start: [-1.2, 1],
    domain: [
      [-2, 2],
      [-1, 3],
    ],
    minimum: 0,
  },
  {
    id: 'himmelblau',
    label: 'Himmelblau / four basins',
    task: 'smooth',
    start: [-3, 0],
    domain: [
      [-5, 5],
      [-5, 5],
    ],
    minimum: 0,
  },
  {
    id: 'rastrigin',
    label: 'Rastrigin / local minima',
    task: 'smooth',
    start: [3.2, 2.8],
    domain: [
      [-5, 5],
      [-5, 5],
    ],
    minimum: 0,
  },
  {
    id: 'beale',
    label: 'Beale polynomial',
    task: 'smooth',
    start: [1, 1],
    domain: [
      [-1, 4],
      [-1, 2],
    ],
    minimum: 0,
  },
  {
    id: 'booth',
    label: 'Booth / convex quadratic',
    task: 'smooth',
    start: [-3, -1],
    domain: [
      [-4, 5],
      [-3, 6],
    ],
    minimum: 0,
  },
  {
    id: 'ill-conditioned',
    label: 'Ill-conditioned bowl',
    task: 'smooth',
    start: [4, 4],
    domain: [
      [-5, 5],
      [-5, 5],
    ],
    minimum: 0,
  },
  {
    id: 'box',
    label: 'Box-constrained bowl',
    task: 'box',
    start: [0, 0],
    domain: [
      [-2, 4],
      [-3, 3],
    ],
    bounds: { lower: [-1, -1], upper: [2, 2] },
    minimum: 5,
  },
  {
    id: 'decay',
    label: 'Robust exponential fit',
    task: 'fit',
    start: [1, 0.2],
    domain: [
      [0, 4],
      [0, 2],
    ],
  },
  { id: 'lasso', label: 'Sparse regression / LASSO', task: 'sparse', start: Array(6).fill(0) },
  {
    id: 'triangle-qp',
    label: 'Triangle quadratic program',
    task: 'qp',
    start: [0, 0],
    domain: [
      [-0.5, 2.5],
      [-0.5, 2.5],
    ],
    minimum: -1.75,
  },
];
export function createCase(id, { seed = 42, lambda = 0.05, loss = 'huber' } = {}) {
  const meta = CATALOG.find((p) => p.id === id);
  requireThat(meta, 'Unknown problem');
  let problem,
    data = null;
  if (id === 'rosenbrock') problem = rosenbrockProblem();
  else if (id === 'himmelblau') problem = himmelblau();
  else if (id === 'rastrigin') problem = rastrigin();
  else if (id === 'beale') problem = beale();
  else if (id === 'booth') problem = booth();
  else if (id === 'ill-conditioned')
    problem = quadraticProblem(
      [
        [2, 0],
        [0, 200],
      ],
      [0, 0],
    );
  else if (id === 'box')
    problem = {
      dimension: 2,
      f: ([x, y]) => (x - 3) ** 2 + 4 * (y + 2) ** 2,
      g: ([x, y]) => [2 * (x - 3), 8 * (y + 2)],
      H: () => [
        [2, 0],
        [0, 8],
      ],
    };
  else if (id === 'decay') {
    data = decayData({ seed, outliers: true });
    problem = leastSquaresProblem({
      dimension: 2,
      residual: ([a, b]) => data.time.map((t, i) => a * Math.exp(-b * t) - data.values[i]),
      jacobian: ([a, b]) => data.time.map((t) => [Math.exp(-b * t), -a * t * Math.exp(-b * t)]),
      loss,
      scale: 0.1,
    });
  } else if (id === 'lasso') {
    data = regressionData({ rows: 40, columns: 6, condition: 5, noise: 0.01, seed });
    const smooth = ridgeProblem(data.A, data.b);
    problem = {
      ...smooth,
      f: (x) => smooth.f(x) * data.A.length,
      g: (x) => smooth.g(x).map((v) => v * data.A.length),
      H: (x) => smooth.H(x).map((row) => row.map((v) => v * data.A.length)),
    };
  } else if (id === 'triangle-qp') {
    problem = quadraticProblem(
      [
        [1, 0],
        [0, 1],
      ],
      [-2, -2],
    );
    data = {
      Q: [
        [1, 0],
        [0, 1],
      ],
      c: [-2, -2],
      G: [
        [1, 1],
        [-1, 0],
        [0, -1],
      ],
      h: [1, 0, 0],
    };
  }
  return {
    meta: { ...meta, start: [...meta.start], domain: meta.domain?.map((r) => [...r]) },
    problem,
    data,
    seed,
    lambda,
  };
}
