import test from 'node:test';
import assert from 'node:assert/strict';

import {patternSearch} from '../src/pattern-search.js';import {quadratic} from './problems.js';
test('direct pattern search locates a quadratic minimum without gradients',()=>{const r=patternSearch(quadratic,[-4,8],{xtol:1e-7});assert.equal(r.status,'converged');assert(r.f<1e-10);assert.equal(r.evaluations.g,0);assert(r.trace.some(t=>t.operation==='refine'));});
