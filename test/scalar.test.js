import test from 'node:test';
import assert from 'node:assert/strict';

import {goldenSection,bisectRoot} from '../src/scalar.js';
test('bounded scalar minimization and sign-bracketed roots match analytical references',()=>{const m=goldenSection(x=>(x-2.5)**2,-4,9);assert.equal(m.status,'converged');assert(Math.abs(m.x-2.5)<1e-7);const r=bisectRoot(x=>x*x-2,0,2);assert(Math.abs(r.x-Math.SQRT2)<1e-9);assert.equal(bisectRoot(x=>x,0,2).x,0);assert.throws(()=>bisectRoot(x=>x*x+1,-1,1));});
