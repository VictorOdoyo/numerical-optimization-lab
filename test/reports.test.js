import test from 'node:test';
import assert from 'node:assert/strict';

import {resultJSON,traceCSV} from '../src/reports.js';
test('result reports retain termination reasons coordinates and explicit missing certificates',()=>{const r={method:'bfgs',status:'max_evaluations',x:[1,2],f:Infinity,trace:[{iteration:0,x:[1,2],f:9,accepted:true}]},j=JSON.parse(resultJSON(r));assert.equal(j.summary.f,null);assert.equal(j.summary.status,'max_evaluations');assert(traceCSV(r).includes('"x0","x1"'));assert(traceCSV(r).includes('"1","2"'));});
