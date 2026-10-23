import test from 'node:test';
import assert from 'node:assert/strict';

import {leastSquaresProblem} from '../src/least-squares.js';import {levenbergMarquardt} from '../src/levenberg-marquardt.js';
test('LM recovers known exponential parameters and reports residual work',()=>{const times=[0,.3,.8,1.3,2,3],ys=times.map(t=>2*Math.exp(-.7*t)),p=leastSquaresProblem({dimension:2,residual:([a,b])=>times.map((t,i)=>a*Math.exp(-b*t)-ys[i]),jacobian:([a,b])=>times.map(t=>[Math.exp(-b*t),-a*t*Math.exp(-b*t)])}),r=levenbergMarquardt(p,[1,.2],{gtol:1e-9});assert.equal(r.status,'converged');assert(Math.hypot(r.x[0]-2,r.x[1]-.7)<1e-7);assert(r.f<1e-16);assert(r.residualEvaluations.residual>r.iterations);});
