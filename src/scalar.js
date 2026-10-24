import { finite, requireThat, integer } from './validation.js';
export function goldenSection(f, lower, upper, { tolerance = 1e-9, maxIterations = 200 } = {}) {
  finite(lower);
  finite(upper);
  requireThat(lower < upper && tolerance > 0, 'Invalid scalar interval/tolerance');
  integer(maxIterations, 'maxIterations', 1, 10000);
  const ratio = (Math.sqrt(5) - 1) / 2;
  let a = lower,
    b = upper,
    c = b - ratio * (b - a),
    d = a + ratio * (b - a),
    fc = finite(f(c)),
    fd = finite(f(d)),
    evaluations = 2,
    iterations = 0;
  for (
    ;
    iterations < maxIterations && b - a > tolerance * (1 + Math.abs((a + b) / 2));
    iterations++
  ) {
    if (fc < fd) {
      b = d;
      d = c;
      fd = fc;
      c = b - ratio * (b - a);
      fc = finite(f(c));
    } else {
      a = c;
      c = d;
      fc = fd;
      d = a + ratio * (b - a);
      fd = finite(f(d));
    }
    evaluations++;
  }
  const x = fc < fd ? c : d;
  return {
    x,
    f: Math.min(fc, fd),
    bracket: [a, b],
    iterations,
    evaluations,
    status: b - a <= tolerance * (1 + Math.abs((a + b) / 2)) ? 'converged' : 'max_iterations',
  };
}
export function bisectRoot(f, lower, upper, { tolerance = 1e-10, maxIterations = 200 } = {}) {
  finite(lower);
  finite(upper);
  requireThat(lower < upper && tolerance > 0, 'Invalid root bracket');
  let a = lower,
    b = upper,
    fa = finite(f(a)),
    fb = finite(f(b)),
    evaluations = 2;
  requireThat(
    fa === 0 || fb === 0 || Math.sign(fa) !== Math.sign(fb),
    'Root endpoints must have opposite signs',
  );
  if (fa === 0 || fb === 0)
    return {
      x: fa === 0 ? a : b,
      f: 0,
      status: 'converged',
      iterations: 0,
      evaluations,
      bracket: [a, b],
    };
  for (let k = 0; k < maxIterations; k++) {
    const x = a + (b - a) / 2,
      fx = finite(f(x));
    evaluations++;
    if (fx === 0 || b - a <= tolerance * (1 + Math.abs(x)))
      return { x, f: fx, status: 'converged', iterations: k + 1, evaluations, bracket: [a, b] };
    if (Math.sign(fa) !== Math.sign(fx)) {
      b = x;
      fb = fx;
    } else {
      a = x;
      fa = fx;
    }
  }
  const x = a + (b - a) / 2;
  return {
    x,
    f: finite(f(x)),
    status: 'max_iterations',
    iterations: maxIterations,
    evaluations: evaluations + 1,
    bracket: [a, b],
  };
}
