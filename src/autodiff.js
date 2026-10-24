import { vector, requireThat, finite } from './validation.js';
export class Jet {
  constructor(value, gradient, hessian) {
    this.value = value;
    this.gradient = gradient;
    this.hessian = hessian;
  }
}
function constant(v, n) {
  finite(v);
  return new Jet(
    v,
    Array(n).fill(0),
    Array.from({ length: n }, () => Array(n).fill(0)),
  );
}
function pair(a, b) {
  const n = a instanceof Jet ? a.gradient.length : b instanceof Jet ? b.gradient.length : 0;
  requireThat(n > 0, 'At least one operand must be a jet');
  a = a instanceof Jet ? a : constant(a, n);
  b = b instanceof Jet ? b : constant(b, n);
  requireThat(a.gradient.length === b.gradient.length, 'Jet dimensions differ');
  return [a, b, n];
}
export function plus(a, b) {
  const [u, v, n] = pair(a, b);
  return new Jet(
    u.value + v.value,
    u.gradient.map((x, i) => x + v.gradient[i]),
    u.hessian.map((r, i) => r.map((x, j) => x + v.hessian[i][j])),
  );
}
export function times(a, b) {
  const [u, v, n] = pair(a, b);
  return new Jet(
    u.value * v.value,
    u.gradient.map((x, i) => x * v.value + u.value * v.gradient[i]),
    u.hessian.map((r, i) =>
      r.map(
        (x, j) =>
          x * v.value +
          u.value * v.hessian[i][j] +
          u.gradient[i] * v.gradient[j] +
          v.gradient[i] * u.gradient[j],
      ),
    ),
  );
}
export function unary(a, value, first, second) {
  requireThat(a instanceof Jet, 'Expected a jet');
  finite(value);
  return new Jet(
    value,
    a.gradient.map((x) => first * x),
    a.hessian.map((r, i) => r.map((x, j) => first * x + second * a.gradient[i] * a.gradient[j])),
  );
}
export function power(a, p) {
  finite(p);
  if (p === 0) return unary(a, 1, 0, 0);
  if (p === 1) return unary(a, a.value, 1, 0);
  return unary(a, a.value ** p, p * a.value ** (p - 1), p * (p - 1) * a.value ** (p - 2));
}
export function exp(a) {
  const v = Math.exp(a.value);
  return unary(a, v, v, v);
}
export function log(a) {
  requireThat(a.value > 0, 'Log requires a positive value');
  return unary(a, Math.log(a.value), 1 / a.value, -1 / a.value ** 2);
}
export function sin(a) {
  return unary(a, Math.sin(a.value), Math.cos(a.value), -Math.sin(a.value));
}
export function cos(a) {
  return unary(a, Math.cos(a.value), -Math.sin(a.value), -Math.cos(a.value));
}
export function minus(a, b) {
  return plus(a, b instanceof Jet ? times(b, -1) : -finite(b));
}
export function divide(a, b) {
  if (!(b instanceof Jet)) {
    requireThat(b !== 0, 'Division by zero');
    return times(a, 1 / b);
  }
  return times(a, power(b, -1));
}
export function differentiate(fn, point) {
  const x = vector(point, 'Point', { max: 32 }),
    n = x.length,
    args = x.map((v, i) => {
      const a = constant(v, n);
      a.gradient[i] = 1;
      return a;
    }),
    result = fn(args);
  requireThat(result instanceof Jet, 'Differentiable function must return a Jet');
  finite(result.value);
  return { value: result.value, gradient: vector(result.gradient), hessian: result.hessian };
}
