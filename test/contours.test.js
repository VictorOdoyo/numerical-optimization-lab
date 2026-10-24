import test from 'node:test';
import assert from 'node:assert/strict';

import { contours } from '../src/contours.js';
import { sampleSurface } from '../src/surface.js';
test('marching-squares intersections satisfy an independent planar level equation', () => {
  const s = sampleSurface(
      { dimension: 2, f: ([x, y]) => x + 2 * y },
      [
        [-2, 2],
        [-2, 2],
      ],
      { resolution: 20 },
    ),
    c = contours(s, [-1, 0, 1]);
  assert(c.every((line) => line.segments.length > 0));
  for (const line of c)
    for (const segment of line.segments)
      for (const [x, y] of segment) assert(Math.abs(x + 2 * y - line.level) < 1e-12);
});
