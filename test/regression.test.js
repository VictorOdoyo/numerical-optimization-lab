import test from 'node:test';
import assert from 'node:assert/strict';

import {ridgeProblem,logisticProblem} from '../src/regression.js';import {checkGradient} from '../src/differences.js';import {modifiedNewton} from '../src/newton.js';
test('ridge fits a known line while logistic derivatives remain finite at extreme margins',()=>{const p=ridgeProblem([[1,0],[1,1],[1,2],[1,3]],[1,3,5,7]),r=modifiedNewton(p,[0,0]);assert(Math.hypot(r.x[0]-1,r.x[1]-2)<1e-10);const q=logisticProblem([[1,2],[1,-1],[-2,1]],[1,0,1]);assert(checkGradient(q,[.3,-.4]).relativeError<1e-8);assert(Number.isFinite(q.f([1000,-1000])));assert(q.g([1000,-1000]).every(Number.isFinite));});
