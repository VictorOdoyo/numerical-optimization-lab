import { run } from './run.js';
import { add, norm } from './vector.js';
import { requireThat } from './validation.js';
export function adam(problem, x0, options = {}) {
  const learningRate = options.learningRate ?? 0.05,
    beta1 = options.beta1 ?? 0.9,
    beta2 = options.beta2 ?? 0.999;
  requireThat(
    Number.isFinite(learningRate) &&
      learningRate > 0 &&
      learningRate <= 10 &&
      beta1 >= 0 &&
      beta1 < 1 &&
      beta2 >= 0 &&
      beta2 < 1,
    'Invalid Adam parameters',
  );
  return run(
    problem,
    x0,
    options,
    (r) => {
      let m = r.x.map(() => 0),
        v = [...m];
      for (let k = 1; k <= r.options.maxIterations; k++) {
        if (r.stationary()) return r.finish('converged');
        m = m.map((a, i) => beta1 * a + (1 - beta1) * r.g[i]);
        v = v.map((a, i) => beta2 * a + (1 - beta2) * r.g[i] * r.g[i]);
        const step = m.map(
            (a, i) =>
              (-learningRate * (a / (1 - beta1 ** k))) /
              (Math.sqrt(v[i] / (1 - beta2 ** k)) + 1e-8),
          ),
          x = add(r.x, step),
          f = r.e.f(x),
          g = r.e.g(x);
        r.update(x, f, g, { stepNorm: norm(step), learningRate, accepted: true });
      }
      return r.finish(r.stationary() ? 'converged' : 'max_iterations');
    },
    { extra: ['learningRate', 'beta1', 'beta2'] },
  );
}
