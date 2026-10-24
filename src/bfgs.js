import { run } from './run.js';
import { strongWolfe, armijo } from './line-search.js';
import { identity, matVec } from './matrix.js';
import { dot, norm, scale, add } from './vector.js';
export function inverseBfgs(H, s, y) {
  const sy = dot(s, y);
  if (!(sy > 1e-10 * norm(s) * norm(y))) return null;
  const Hy = matVec(H, y),
    yHy = dot(y, Hy),
    coefficient = (sy + yHy) / (sy * sy);
  return H.map((row, i) =>
    row.map((v, j) => v + coefficient * s[i] * s[j] - (Hy[i] * s[j] + s[i] * Hy[j]) / sy),
  );
}
export function bfgs(problem, x0, options = {}) {
  return run(problem, x0, options, (r) => {
    let H = identity(r.x.length);
    for (let k = 0; k < r.options.maxIterations; k++) {
      if (r.stationary()) return r.finish('converged');
      let d = scale(matVec(H, r.g), -1),
        reset = false;
      if (dot(d, r.g) >= -1e-14 * norm(d) * norm(r.g)) {
        H = identity(r.x.length);
        d = scale(r.g, -1);
        reset = true;
      }
      let line = strongWolfe(r.e, r.x, r.f, r.g, d);
      if (!line.accepted) line = armijo(r.e, r.x, r.f, r.g, d);
      if (!line.accepted) return r.finish('line_search_failed');
      const g = line.g ?? r.e.g(line.x),
        s = add(line.x, r.x, -1),
        y = add(g, r.g, -1),
        tiny = r.tiny(s),
        next = inverseBfgs(H, s, y);
      H = next ?? identity(r.x.length);
      r.update(line.x, line.f, g, {
        alpha: line.alpha,
        stepNorm: norm(s),
        curvature: dot(s, y),
        reset: reset || !next,
        accepted: true,
      });
      if (r.stationary()) return r.finish('converged');
      if (tiny) return r.finish('stagnated');
    }
    return r.finish('max_iterations');
  });
}
