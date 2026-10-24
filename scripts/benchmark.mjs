import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createCase, solveCase, random } from '../src/index.js';
const rows = [];
for (const id of ['rosenbrock', 'booth', 'ill-conditioned'])
  for (const seed of [7, 42, 91]) {
    const c = createCase(id),
      rng = random(seed),
      start = c.meta.start.map((v) => v + 0.1 * (rng() - 0.5));
    for (const method of ['bfgs', 'lbfgs', 'newton', 'trust']) {
      const r = solveCase(c, method, { start, options: { gtol: 1e-7 } });
      assert(r.f < 1e-8, id + '/' + method);
      assert(r.x.every(Number.isFinite));
      assert(r.evaluations.calls <= 50000);
      rows.push({
        problem: id,
        seed,
        method,
        status: r.status,
        f: r.f,
        iterations: r.iterations,
        calls: r.evaluations.calls,
        elapsedMs: r.elapsedMs,
      });
    }
  }
mkdirSync('results', { recursive: true });
writeFileSync('results/benchmark.json', JSON.stringify(rows, null, 2));
console.table(rows);
console.log(
  '36 seeded runs reached analytical benchmark objective tolerances; timings are observational.',
);
