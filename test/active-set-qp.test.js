import test from 'node:test';
import assert from 'node:assert/strict';

import {activeSetQP} from '../src/active-set-qp.js';
test('active-set QP finds a constrained triangle optimum and nonnegative multipliers',()=>{const r=activeSetQP([[1,0],[0,1]],[-2,-2],[[1,1],[-1,0],[0,-1]],[1,0,0],[0,0]);assert.equal(r.status,'converged');assert(Math.hypot(r.x[0]-.5,r.x[1]-.5)<1e-8);assert(Math.abs(r.multipliers[0]-1.5)<1e-8);assert(r.multipliers.every(v=>v>=-1e-8));assert(r.primalResidual<1e-8&&r.dualResidual<1e-8);assert.throws(()=>activeSetQP([[1,0],[0,1]],[0,0],[[1,1]],[1],[2,2]));});
