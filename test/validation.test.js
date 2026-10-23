import test from 'node:test';
import assert from 'node:assert/strict';

import {finite,vector,matrix,integer,options} from '../src/validation.js';
test('numerical contracts reject nonfinite ragged and oversized data',()=>{for(const x of[NaN,Infinity,'1'])assert.throws(()=>finite(x));assert.deepEqual(vector(new Float64Array([1,2])),[1,2]);assert.throws(()=>matrix([[1],[2,3]]));assert.throws(()=>integer(1.5,'n'));assert.throws(()=>options({typo:1},['maxIterations']));});
