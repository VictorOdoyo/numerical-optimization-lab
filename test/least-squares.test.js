import test from 'node:test';
import assert from 'node:assert/strict';

import {leastSquaresProblem} from '../src/least-squares.js';import {checkGradient} from '../src/differences.js';
test('robust least-squares adapters produce consistent gradients and explicit residual counters',()=>{const p=leastSquaresProblem({dimension:2,residual:([a,b])=>[a+b-1,2*a-b-3,a+3*b+8],jacobian:()=>[[1,1],[2,-1],[1,3]],loss:'huber',scale:.7});assert(checkGradient(p,[.3,.1]).relativeError<1e-8);assert.equal(p.hessianModel,'weighted-gauss-newton');assert(p.counts.residual>0&&p.counts.jacobian>0);const q=leastSquaresProblem({dimension:1,residual:([x])=>[x*x-4,x-2]});assert(Math.abs(q.g([3])[0]-31)<1e-7);});
