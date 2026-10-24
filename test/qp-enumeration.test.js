import test from 'node:test';
import assert from 'node:assert/strict';
import { activeSetQP } from '../src/active-set-qp.js';
test('active-set solutions agree with independent edge and vertex enumeration on a triangle', () => {
  const vertices = [
    [0, 0],
    [1, 0],
    [0, 1],
  ];
  for (const target of [
    [2, 2],
    [-2, 1],
    [0.2, 0.3],
    [0.7, -4],
    [-1, -2],
  ]) {
    const candidates = [...vertices];
    if (target[0] >= 0 && target[1] >= 0 && target[0] + target[1] <= 1) candidates.push(target);
    for (let i = 0; i < 3; i++) {
      const a = vertices[i],
        b = vertices[(i + 1) % 3],
        d = [b[0] - a[0], b[1] - a[1]],
        t = Math.max(
          0,
          Math.min(
            1,
            ((target[0] - a[0]) * d[0] + (target[1] - a[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2),
          ),
        );
      candidates.push([a[0] + t * d[0], a[1] + t * d[1]]);
    }
    const cost = (x) => (x[0] - target[0]) ** 2 + (x[1] - target[1]) ** 2,
      best = candidates.sort((a, b) => cost(a) - cost(b))[0],
      r = activeSetQP(
        [
          [1, 0],
          [0, 1],
        ],
        target.map((v) => -v),
        [
          [1, 1],
          [-1, 0],
          [0, -1],
        ],
        [1, 0, 0],
        [0, 0],
      );
    assert(Math.hypot(r.x[0] - best[0], r.x[1] - best[1]) < 1e-7);
  }
});
