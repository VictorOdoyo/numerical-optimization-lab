import { random, normal } from './random.js';
import { qr } from './qr.js';
import { transpose, matMul, matVec, diagonal } from './matrix.js';
import { integer, requireThat } from './validation.js';
export function regressionData({
  rows = 40,
  columns = 4,
  condition = 10,
  noise = 0.02,
  seed = 42,
} = {}) {
  integer(rows, 'rows', 2, 256);
  integer(columns, 'columns', 1, Math.min(rows, 32));
  requireThat(
    condition >= 1 && condition <= 1e6 && noise >= 0 && noise <= 100,
    'Invalid data condition or noise',
  );
  const rng = normal(random(seed)),
    U = qr(Array.from({ length: rows }, () => Array.from({ length: columns }, rng))).Q.map((r) =>
      r.slice(0, columns),
    ),
    V = qr(Array.from({ length: columns }, () => Array.from({ length: columns }, rng))).Q,
    singularValues = Array.from(
      { length: columns },
      (_, i) => condition ** (-i / Math.max(1, columns - 1)),
    ),
    A = matMul(matMul(U, diagonal(singularValues)), transpose(V)),
    truth = Array.from({ length: columns }, rng),
    clean = matVec(A, truth),
    b = clean.map((v) => v + noise * rng());
  return { A, b, truth, clean, singularValues, seed };
}
export function decayData({ seed = 42, noise = 0.02, outliers = false } = {}) {
  const rng = normal(random(seed)),
    truth = [2, 0.7],
    time = Array.from({ length: 30 }, (_, i) => i / 10),
    values = time.map(
      (t, i) => 2 * Math.exp(-0.7 * t) + noise * rng() + (outliers && i % 11 === 0 ? 0.8 : 0),
    );
  return { time, values, truth, seed };
}
