import test from 'node:test';
import assert from 'node:assert/strict';

import {nelderMead} from '../src/nelder-mead.js';import {quadratic,rosenbrock} from './problems.js';
test('Nelder-Mead converges by simplex criteria without requesting derivatives',()=>{for(const[p,x]of[[quadratic,[-4,8]],[rosenbrock,[-1.2,1]]]){const r=nelderMead(p,x,{xtol:1e-8,ftol:1e-12});assert.equal(r.status,'converged');assert(r.f<1e-12);assert.equal(r.evaluations.g,0);assert.equal(r.gradientNorm,null);}});
