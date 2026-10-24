import { differentiate, plus, minus, times, power } from './autodiff.js';
import { diagonal } from './matrix.js';
export function himmelblau() {
  return {
    dimension: 2,
    f: ([x, y]) => (x * x + y - 11) ** 2 + (x + y * y - 7) ** 2,
    g: ([x, y]) => [
      4 * x * (x * x + y - 11) + 2 * (x + y * y - 7),
      2 * (x * x + y - 11) + 4 * y * (x + y * y - 7),
    ],
    H: ([x, y]) => [
      [12 * x * x + 4 * y - 42, 4 * (x + y)],
      [4 * (x + y), 12 * y * y + 4 * x - 26],
    ],
  };
}
export function rastrigin(dimension = 2) {
  return {
    dimension,
    f: (x) => 10 * dimension + x.reduce((s, v) => s + v * v - 10 * Math.cos(2 * Math.PI * v), 0),
    g: (x) => x.map((v) => 2 * v + 20 * Math.PI * Math.sin(2 * Math.PI * v)),
    H: (x) => diagonal(x.map((v) => 2 + 40 * Math.PI * Math.PI * Math.cos(2 * Math.PI * v))),
  };
}
export function beale() {
  const expression = ([x, y]) =>
      plus(
        plus(
          power(plus(minus(1.5, x), times(x, y)), 2),
          power(plus(minus(2.25, x), times(x, power(y, 2))), 2),
        ),
        power(plus(minus(2.625, x), times(x, power(y, 3))), 2),
      ),
    at = (x) => differentiate(expression, x);
  return { dimension: 2, f: (x) => at(x).value, g: (x) => at(x).gradient, H: (x) => at(x).hessian };
}
export function booth() {
  return {
    dimension: 2,
    f: ([x, y]) => (x + 2 * y - 7) ** 2 + (2 * x + y - 5) ** 2,
    g: ([x, y]) => [10 * x + 8 * y - 34, 8 * x + 10 * y - 38],
    H: () => [
      [10, 8],
      [8, 10],
    ],
  };
}
