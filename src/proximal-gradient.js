import { run } from './run.js';
import { softThreshold } from './projections.js';
import { add, dot, norm, infNorm } from './vector.js';
import { requireThat } from './validation.js';
export const l1Norm = (x) => x.reduce((s, v) => s + Math.abs(v), 0);
export function proximalGradient(
  smooth,
  x0,
  { lambda = 1, accelerated = false, initialL = 1, ...options } = {},
) {
  requireThat(
    lambda >= 0 && Number.isFinite(lambda) && initialL > 0 && Number.isFinite(initialL),
    'Invalid proximal parameters',
  );
  const problem = { ...smooth, f: (x) => smooth.f(x) + lambda * l1Norm(x) },
    mapping = (x, g) => add(x, softThreshold(add(x, g, -1), lambda), -1);
  return run(problem, x0, options, (r) => {
    let y = [...r.x],
      t = 1,
      L = initialL;
    r.g = mapping(r.x, r.g);
    r.trace[0].gradientNorm = infNorm(r.g);
    for (let k = 0; k < r.options.maxIterations; k++) {
      if (r.stationary())
        return r.finish('converged', 'Proximal-gradient mapping tolerance satisfied');
      let restarted = false,
        candidate = null;
      for (let retry = 0; retry < 2; retry++) {
        const fy = r.e.f(y) - lambda * l1Norm(y),
          gy = r.e.g(y);
        for (let backtrack = 0; backtrack < 50; backtrack++) {
          const x = softThreshold(add(y, gy, -1 / L), lambda / L),
            step = add(x, y, -1),
            full = r.e.f(x);
          if (
            full - lambda * l1Norm(x) <=
            fy + dot(gy, step) + 0.5 * L * dot(step, step) + 1e-12 * Math.max(1, Math.abs(fy))
          ) {
            candidate = { x, f: full };
            break;
          }
          L *= 2;
        }
        if (!candidate) return r.finish('line_search_failed');
        if (accelerated && candidate.f > r.f + 1e-12) {
          y = [...r.x];
          t = 1;
          candidate = null;
          restarted = true;
          continue;
        }
        break;
      }
      if (!candidate) return r.finish('line_search_failed');
      const old = [...r.x],
        step = add(candidate.x, old, -1),
        g = mapping(candidate.x, r.e.g(candidate.x)),
        nextT = accelerated ? (1 + Math.sqrt(1 + 4 * t * t)) / 2 : 1;
      y = add(candidate.x, step, (t - 1) / nextT);
      t = nextT;
      r.update(candidate.x, candidate.f, g, {
        L,
        restarted,
        accelerated,
        stepNorm: norm(step),
        accepted: true,
      });
    }
    return r.finish(r.stationary() ? 'converged' : 'max_iterations');
  });
}
export function fista(problem, x0, options = {}) {
  return proximalGradient(problem, x0, { ...options, accelerated: true });
}
