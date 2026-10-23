import test from 'node:test';
import assert from 'node:assert/strict';

import {equalityQP} from '../src/equality-qp.js';
test('equality QP solves a KKT system with primal and dual certificates',()=>{const r=equalityQP([[2,0],[0,2]],[-4,-2],[[1,1]],[1]);assert(Math.hypot(r.x[0]-1,r.x[1])<1e-12);assert(Math.abs(r.multipliers[0]-2)<1e-12);assert(r.primalResidual<1e-12&&r.dualResidual<1e-12);assert.throws(()=>equalityQP([[1,0],[0,1]],[0,0],[[1,1],[2,2]],[1,2]));});
