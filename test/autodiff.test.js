import test from 'node:test';
import assert from 'node:assert/strict';

import {differentiate,plus,minus,times,power,exp,log,sin,divide} from '../src/autodiff.js';
test('second-order jets recover Rosenbrock derivatives without finite differences',()=>{const f=([x,y])=>plus(power(minus(1,x),2),times(100,power(minus(y,power(x,2)),2))),x=-1.2,y=1,r=differentiate(f,[x,y]);assert(Math.abs(r.value-24.2)<1e-10);assert(Math.abs(r.gradient[0]+215.6)<1e-10);assert(Math.abs(r.hessian[0][0]-1330)<1e-10);assert(Math.abs(r.hessian[0][1]-480)<1e-10);});
test('jet chain and quotient rules match independent elementary derivatives',()=>{const r=differentiate(([x])=>plus(log(exp(x)),divide(sin(x),2)),[.5]);assert(Math.abs(r.gradient[0]-(1+Math.cos(.5)/2))<1e-12);assert(Math.abs(r.hessian[0][0]+Math.sin(.5)/2)<1e-12);});
