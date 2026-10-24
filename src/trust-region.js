import { run } from './run.js';
import { steihaug } from './trust-subproblem.js';
import { dot, norm, add } from './vector.js';
import { matVec } from './matrix.js';
import { requireThat } from './validation.js';
export function trustRegion(problem, x0, options = {}) {
  const initialRadius = options.initialRadius ?? 1,
    maxRadius = options.maxRadius ?? 100;
  requireThat(
    initialRadius > 0 && initialRadius <= maxRadius && Number.isFinite(maxRadius),
    'Invalid trust radii',
  );
  return run(
    problem,
    x0,
    options,
    (r) => {
      let radius = initialRadius;
      for (let k = 0; k < r.options.maxIterations; k++) {
        if (r.stationary()) return r.finish('converged');
        const H = r.e.H(r.x),
          sub = steihaug(r.g, H, radius, { tolerance: Math.min(0.5, Math.sqrt(norm(r.g))) }),
          step = sub.step,
          predicted = -dot(r.g, step) - 0.5 * dot(step, matVec(H, step));
        if (!(predicted > 0)) return r.finish('model_failed');
        const trial = add(r.x, step);
        let f = Infinity;
        try {
          f = r.e.f(trial);
        } catch (error) {
          if (error.code !== 'NONFINITE') throw error;
        }
        const ratio = (r.f - f) / predicted,
          accepted = ratio > 0.1;
        if (ratio < 0.25) radius *= 0.25;
        else if (ratio > 0.75 && norm(step) >= 0.99 * radius)
          radius = Math.min(2 * radius, maxRadius);
        if (accepted) {
          const g = r.e.g(trial);
          r.update(trial, f, g, {
            radius,
            ratio,
            accepted,
            stepNorm: norm(step),
            subproblem: sub.reason,
          });
        } else
          r.update(r.x, r.f, r.g, {
            radius,
            ratio: Number.isFinite(ratio) ? ratio : null,
            accepted,
            stepNorm: 0,
            subproblem: sub.reason,
          });
        if (radius <= r.options.xtol * (1 + norm(r.x)))
          return r.finish(r.stationary() ? 'converged' : 'stagnated');
      }
      return r.finish('max_iterations');
    },
    { extra: ['initialRadius', 'maxRadius'] },
  );
}
