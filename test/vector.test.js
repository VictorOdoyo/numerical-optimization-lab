import test from 'node:test';
import assert from 'node:assert/strict';

import {norm,dot,add,distance} from '../src/vector.js';
test('scaled norms avoid unnecessary overflow and underflow',()=>{assert(Math.abs(norm([3e200,4e200])/5e200-1)<1e-15);assert(Math.abs(norm([3e-200,4e-200])/5e-200-1)<1e-15);assert.equal(norm([0,0]),0);assert.equal(dot([1,2,3],[4,5,6]),32);assert.equal(distance([1,2],[4,6]),5);assert.throws(()=>add([1],[1,2]));});
