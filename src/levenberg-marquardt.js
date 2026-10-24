import { run } from './run.js';
import { cholesky, choleskySolve } from './cholesky.js';
import { matVec } from './matrix.js';
import { add, scale, norm, dot } from './vector.js';
import { requireThat } from './validation.js';
export function levenbergMarquardt(problem, x0, options = {}) {
  requireThat(
    problem.hessianModel === 'weighted-gauss-newton',
    'LM requires a leastSquaresProblem adapter',
  );
  return run(problem, x0, options, (r) => {
    let damping = 0,
      nu = 2;
    for (let k = 0; k < r.options.maxIterations; k++) {
      if (r.stationary())
        return { ...r.finish('converged'), residualEvaluations: { ...problem.counts } };
      const H = r.e.H(r.x);
      if (k === 0) damping = 1e-3 * Math.max(1, ...H.map((row, i) => row[i]));
      const step = choleskySolve(cholesky(H, { shift: damping }), scale(r.g, -1)),
        predicted = -dot(r.g, step) - 0.5 * dot(step, matVec(H, step));
      if (!(predicted > 0)) return r.finish('model_failed');
      const x = add(r.x, step);
      let f = Infinity;
      try {
        f = r.e.f(x);
      } catch (error) {
        if (error.code !== 'NONFINITE') throw error;
      }
      const ratio = (r.f - f) / predicted,
        accepted = ratio > 0;
      if (accepted) {
        damping *= Math.max(1 / 3, 1 - (2 * ratio - 1) ** 3);
        damping = Math.max(damping, 1e-15);
        nu = 2;
        const g = r.e.g(x);
        r.update(x, f, g, { damping, ratio, accepted, stepNorm: norm(step) });
      } else {
        damping *= nu;
        nu *= 2;
        r.update(r.x, r.f, r.g, {
          damping,
          ratio: Number.isFinite(ratio) ? ratio : null,
          accepted: false,
          stepNorm: 0,
        });
      }
      if (!Number.isFinite(damping) || damping > 1e30) return r.finish('stagnated');
    }
    return {
      ...r.finish(r.stationary() ? 'converged' : 'max_iterations'),
      residualEvaluations: { ...problem.counts },
    };
  });
}
