import test from 'node:test';
import assert from 'node:assert/strict';

import {run} from '../src/run.js';import {quadratic} from './problems.js';
test('run contracts retain last valid points on budget and cancellation without inventing convergence',()=>{const a=run(quadratic,[0,0],{maxEvaluations:1},r=>r.finish('unused'));assert.equal(a.status,'max_evaluations');assert.equal(a.f,25);const b=run(quadratic,[0,0],{onIteration:()=>false},r=>r.finish('unused'));assert.equal(b.status,'cancelled');assert.equal(b.trace.length,1);assert.throws(()=>run(quadratic,[0,0],{typo:1},()=>{}));});
