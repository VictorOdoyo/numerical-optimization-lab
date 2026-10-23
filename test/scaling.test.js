import test from 'node:test';
import assert from 'node:assert/strict';

import {scaledProblem} from '../src/scaling.js';import {quadraticProblem} from '../src/quadratic-problem.js';import {checkGradient} from '../src/differences.js';
test('variable scaling preserves objective values and applies exact derivative chain rules',()=>{const p=quadraticProblem([[2,1],[1,6]],[-2,4]),s=scaledProblem(p,{center:[3,-2],scale:[.1,10]}),y=[.5,-.7];assert.equal(s.problem.f(y),p.f(s.toOriginal(y)));assert(checkGradient(s.problem,y).relativeError<1e-8);assert.deepEqual(s.toScaled(s.toOriginal(y)).map(v=>Math.round(v*10)/10),y);assert(Math.abs(s.problem.H(y)[0][1]-1)<1e-12);});
