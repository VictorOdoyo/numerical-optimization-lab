import test from 'node:test';
import assert from 'node:assert/strict';

import {Evaluator} from '../src/evaluation.js';
test('evaluation budgets include numerical derivative objective calls and preserve caller inputs',()=>{const x=[2,3],e=new Evaluator({dimension:2,f:v=>{const value=v[0]**2+v[1]**2;v[0]=99;return value;}},{maxEvaluations:5});assert.equal(e.f(x),13);assert.deepEqual(x,[2,3]);e.g(x);assert.equal(e.counts.f,5);assert.throws(()=>e.f(x),error=>error.code==='BUDGET');assert.throws(()=>new Evaluator({dimension:1,f:()=>Infinity}).f([0]),error=>error.code==='NONFINITE');});
