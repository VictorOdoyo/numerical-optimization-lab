import { run } from './run.js';
import { strongWolfe, armijo } from './line-search.js';
import { dot, norm, add, scale } from './vector.js';
import { integer } from './validation.js';
export function twoLoop(gradient, history) {
  let q = [...gradient];
  const alpha = [];
  for (let i = history.length - 1; i >= 0; i--) {
    const h = history[i];
    alpha[i] = h.rho * dot(h.s, q);
    q = add(q, h.y, -alpha[i]);
  }
  const last = history.at(-1),
    gamma = last ? dot(last.s, last.y) / dot(last.y, last.y) : 1;
  let z = scale(q, gamma);
  for (let i = 0; i < history.length; i++) {
    const h = history[i],
      beta = h.rho * dot(h.y, z);
    z = add(z, h.s, alpha[i] - beta);
  }
  return scale(z, -1);
}
export function lbfgs(problem, x0, options = {}) {
  const memory = integer(options.memory ?? 8, 'memory', 1, 50);
  return run(
    problem,
    x0,
    options,
    (r) => {
      let history = [];
      for (let k = 0; k < r.options.maxIterations; k++) {
        if (r.stationary()) return r.finish('converged');
        let d = twoLoop(r.g, history);
        if (dot(d, r.g) >= 0) {
          history = [];
          d = scale(r.g, -1);
        }
        let line = strongWolfe(r.e, r.x, r.f, r.g, d);
        if (!line.accepted) line = armijo(r.e, r.x, r.f, r.g, d);
        if (!line.accepted) return r.finish('line_search_failed');
        const g = line.g ?? r.e.g(line.x),
          s = add(line.x, r.x, -1),
          y = add(g, r.g, -1),
          sy = dot(s, y),
          tiny = r.tiny(s);
        if (sy > 1e-10 * norm(s) * norm(y)) {
          history.push({ s, y, rho: 1 / sy });
          if (history.length > memory) history.shift();
        }
        r.update(line.x, line.f, g, {
          alpha: line.alpha,
          stepNorm: norm(s),
          historySize: history.length,
          accepted: true,
        });
        if (r.stationary()) return r.finish('converged');
        if (tiny) return r.finish('stagnated');
      }
      return r.finish('max_iterations');
    },
    { extra: ['memory'] },
  );
}
