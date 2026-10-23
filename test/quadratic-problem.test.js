import test from 'node:test';
import assert from 'node:assert/strict';

import {quadraticProblem} from '../src/quadratic-problem.js';import {solve} from '../src/lu.js';import {checkGradient} from '../src/differences.js';
test('quadratic models expose exact derivatives and closed-form stationary references',()=>{const Q=[[4,1],[1,3]],c=[-2,4],p=quadraticProblem(Q,c),x=solve(Q,c.map(v=>-v));assert(Math.hypot(...p.g(x))<1e-12);assert(checkGradient(p,[1,2]).relativeError<1e-9);Q[0][0]=99;assert.equal(p.H()[0][0],4);});
