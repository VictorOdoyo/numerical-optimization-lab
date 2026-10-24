import test from 'node:test';
import assert from 'node:assert/strict';

import { himmelblau, rastrigin, beale, booth } from '../src/landscapes.js';
import { checkGradient } from '../src/differences.js';
test('multimodal and polynomial landscapes match documented minimizers and derivative checks', () => {
  for (const [p, x] of [
    [himmelblau(), [3, 2]],
    [rastrigin(), [0, 0]],
    [beale(), [3, 0.5]],
    [booth(), [1, 3]],
  ]) {
    assert(Math.abs(p.f(x)) < 1e-12);
    assert(Math.hypot(...p.g(x)) < 1e-10);
    assert(checkGradient(p, [0.6, 0.8]).relativeError < 1e-7);
  }
  assert(himmelblau().f([-2.805118, 3.131312]) < 1e-8);
});
