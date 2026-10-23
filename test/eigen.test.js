import test from 'node:test';
import assert from 'node:assert/strict';

import {eigenSymmetric} from '../src/eigen.js';import {matVec} from '../src/matrix.js';import {norm,add} from '../src/vector.js';
test('Jacobi eigensystem satisfies independent residual and trace invariants',()=>{const A=[[3,1,.5],[1,2,-.2],[.5,-.2,4]],e=eigenSymmetric(A);assert(e.converged);for(let j=0;j<3;j++){const v=e.vectors.map(r=>r[j]);assert(norm(add(matVec(A,v),v.map(x=>x*e.values[j]),-1))<1e-10);}assert(Math.abs(e.values.reduce((a,b)=>a+b)-9)<1e-12);const b=eigenSymmetric([[2,1],[1,2]]);assert(Math.abs(b.values[0]-1)<1e-12);assert(Math.abs(b.values[1]-3)<1e-12);});
