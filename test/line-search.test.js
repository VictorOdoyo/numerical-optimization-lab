import test from 'node:test';
import assert from 'node:assert/strict';

import { Evaluator } from '../src/evaluation.js';
import { armijo, strongWolfe } from '../src/line-search.js';
import { dot } from '../src/vector.js';
test('line searches satisfy sufficient decrease and strong curvature inequalities', () => {
  const e = new Evaluator({
      dimension: 2,
      f: ([x, y]) => 50 * x * x + y * y,
      g: ([x, y]) => [100 * x, 2 * y],
    }),
    x = [2, 3],
    f = e.f(x),
    g = e.g(x),
    d = g.map((v) => -v);
  const a = armijo(e, x, f, g, d);
  assert(a.accepted);
  assert(a.f <= f + 1e-4 * a.alpha * dot(g, d));
  const w = strongWolfe(e, x, f, g, d);
  assert(w.accepted);
  assert(Math.abs(dot(w.g, d)) <= 0.9 * Math.abs(dot(g, d)));
  assert.throws(() => armijo(e, x, f, g, g));
});
