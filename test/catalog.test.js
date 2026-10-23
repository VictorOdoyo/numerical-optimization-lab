import test from 'node:test';
import assert from 'node:assert/strict';

import {CATALOG,createCase} from '../src/catalog.js';
test('all catalog cases have finite starting objectives and independent data',()=>{for(const meta of CATALOG){const c=createCase(meta.id);assert(Number.isFinite(c.problem.f(meta.start)));assert.equal(c.problem.dimension,meta.start.length);assert(c.problem.g(meta.start).every(Number.isFinite));}const a=createCase('decay',{seed:9}),b=createCase('decay',{seed:9});assert.deepEqual(a.data,b.data);assert.throws(()=>createCase('missing'));});
