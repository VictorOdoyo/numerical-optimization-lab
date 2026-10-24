import { integer } from './validation.js';
export function rosenbrockProblem(dimension = 2) {
  integer(dimension, 'dimension', 2, 128);
  return {
    dimension,
    f: (x) => {
      let sum = 0;
      for (let i = 0; i < dimension - 1; i++)
        sum += 100 * (x[i + 1] - x[i] * x[i]) ** 2 + (1 - x[i]) ** 2;
      return sum;
    },
    g: (x) => {
      const g = Array(dimension).fill(0);
      for (let i = 0; i < dimension - 1; i++) {
        g[i] += -400 * x[i] * (x[i + 1] - x[i] * x[i]) - 2 * (1 - x[i]);
        g[i + 1] += 200 * (x[i + 1] - x[i] * x[i]);
      }
      return g;
    },
    H: (x) => {
      const H = Array.from({ length: dimension }, () => Array(dimension).fill(0));
      for (let i = 0; i < dimension - 1; i++) {
        H[i][i] += 1200 * x[i] * x[i] - 400 * x[i + 1] + 2;
        H[i + 1][i + 1] += 200;
        H[i][i + 1] = H[i + 1][i] = -400 * x[i];
      }
      return H;
    },
  };
}
