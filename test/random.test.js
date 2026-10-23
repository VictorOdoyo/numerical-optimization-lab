import test from 'node:test';
import assert from 'node:assert/strict';

import {random,normal} from '../src/random.js';
test('isolated random streams replay exactly and generated normals have stable sample moments',()=>{const a=normal(random(17)),b=normal(random(17));assert.deepEqual(Array.from({length:30},a),Array.from({length:30},b));const r=normal(random(91)),x=Array.from({length:20000},r),mean=x.reduce((a,b)=>a+b)/x.length,variance=x.reduce((s,v)=>s+(v-mean)**2,0)/x.length;assert(Math.abs(mean)<.03);assert(Math.abs(variance-1)<.04);});
