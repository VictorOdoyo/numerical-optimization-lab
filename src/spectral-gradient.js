import { run } from './run.js';
import { armijo } from './line-search.js';
import { dot, norm, scale, add } from './vector.js';
export function spectralGradient(problem, x0, options = {}) {
  return run(problem, x0, options, (r) => {
    let alpha = 1;
    const values = [r.f];
    for (let k = 0; k < r.options.maxIterations; k++) {
      if (r.stationary()) return r.finish('converged');
      const reference = Math.max(...values),
        line = armijo(r.e, r.x, reference, r.g, scale(r.g, -1), { initial: alpha });
      if (!line.accepted) return r.finish('line_search_failed');
      const g = r.e.g(line.x),
        s = add(line.x, r.x, -1),
        y = add(g, r.g, -1),
        sy = dot(s, y),
        tiny = r.tiny(s);
      alpha = sy > 0 ? Math.max(1e-12, Math.min(1e6, dot(s, s) / sy)) : 1;
      values.push(line.f);
      if (values.length > 10) values.shift();
      r.update(line.x, line.f, g, {
        alpha: line.alpha,
        nextSpectralStep: alpha,
        reference,
        stepNorm: norm(s),
        accepted: true,
      });
      if (r.stationary()) return r.finish('converged');
      if (tiny) return r.finish('stagnated');
    }
    return r.finish('max_iterations');
  });
}
