import test from 'node:test';
import assert from 'node:assert/strict';

import {steihaug} from '../src/trust-subproblem.js';import {norm} from '../src/vector.js';
test('truncated CG solves interior models and moves to the boundary on negative curvature',()=>{const a=steihaug([2,4],[[2,0],[0,2]],10,{tolerance:1e-12});assert(Math.hypot(a.step[0]+1,a.step[1]+2)<1e-12);const b=steihaug([1,1],[[-1,0],[0,-2]],.5);assert.equal(b.reason,'negative_curvature');assert(Math.abs(norm(b.step)-.5)<1e-12);const c=steihaug([2,4],[[2,0],[0,2]],.1);assert(Math.abs(norm(c.step)-.1)<1e-12);});
