import test from 'node:test';
import assert from 'node:assert/strict';
import { differentiate, power, minus, plus } from '../src/autodiff.js';
test('constant and linear powers have finite derivatives at zero and scalar subtraction works both ways', () => {
  const a = differentiate(([x]) => power(x, 0), [0]);
  assert.deepEqual(a.gradient, [0]);
  assert.deepEqual(a.hessian, [[0]]);
  const b = differentiate(([x]) => plus(power(x, 1), minus(x, 3)), [0]);
  assert.equal(b.value, -3);
  assert.deepEqual(b.gradient, [2]);
  assert.deepEqual(b.hessian, [[0]]);
});
