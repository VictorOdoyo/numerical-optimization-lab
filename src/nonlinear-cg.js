import { run } from './run.js';
import { strongWolfe } from './line-search.js';
import { dot, norm, scale, add } from './vector.js';
export function nonlinearCG(problem, x0, options = {}) {
  return run(problem, x0, options, (r) => {
    let d = scale(r.g, -1);
    for (let k = 0; k < r.options.maxIterations; k++) {
      if (r.stationary()) return r.finish('converged');
      if (dot(d, r.g) >= -0.001 * dot(r.g, r.g)) d = scale(r.g, -1);
      const line = strongWolfe(r.e, r.x, r.f, r.g, d, { c2: 0.1 });
      if (!line.accepted) return r.finish('line_search_failed');
      const g = line.g,
        s = add(line.x, r.x, -1),
        tiny = r.tiny(s),
        beta =
          (k + 1) % r.x.length === 0
            ? 0
            : Math.max(0, dot(g, add(g, r.g, -1)) / Math.max(Number.MIN_VALUE, dot(r.g, r.g)));
      d = add(scale(g, -1), d, beta);
      r.update(line.x, line.f, g, { alpha: line.alpha, beta, stepNorm: norm(s), accepted: true });
      if (r.stationary()) return r.finish('converged');
      if (tiny) return r.finish('stagnated');
    }
    return r.finish('max_iterations');
  });
}
