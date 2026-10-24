import { run } from './run.js';
import { armijo } from './line-search.js';
import { scale, add, norm } from './vector.js';
export function gradientDescent(problem, x0, options = {}) {
  return run(problem, x0, options, (r) => {
    for (let k = 0; k < r.options.maxIterations; k++) {
      if (r.stationary()) return r.finish('converged', 'Gradient tolerance satisfied');
      const d = scale(r.g, -1),
        line = armijo(r.e, r.x, r.f, r.g, d);
      if (!line.accepted) return r.finish('line_search_failed');
      const step = add(line.x, r.x, -1),
        tiny = r.tiny(step),
        g = r.e.g(line.x);
      r.update(line.x, line.f, g, { alpha: line.alpha, stepNorm: norm(step), accepted: true });
      if (r.stationary()) return r.finish('converged');
      if (tiny)
        return r.finish('stagnated', 'Step tolerance reached with a nonstationary gradient');
    }
    return r.finish('max_iterations');
  });
}
