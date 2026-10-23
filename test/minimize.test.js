import test from 'node:test';
import assert from 'node:assert/strict';

import {createCase} from '../src/catalog.js';import {solveCase} from '../src/minimize.js';
test('dispatch preserves method compatibility and constrained objective semantics',()=>{const a=solveCase(createCase('rosenbrock'),'bfgs');assert.equal(a.status,'converged');assert(a.f<1e-10);const b=solveCase(createCase('box'),'projected');assert(Math.abs(b.f-5)<1e-8);const q=solveCase(createCase('triangle-qp'),'active');assert(Math.abs(q.f+1.75)<1e-8);assert.throws(()=>solveCase(createCase('box'),'bfgs'));});
