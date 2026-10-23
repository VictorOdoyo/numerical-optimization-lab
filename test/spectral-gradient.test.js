import test from 'node:test';
import assert from 'node:assert/strict';

import {spectralGradient} from '../src/spectral-gradient.js';
test('Barzilai-Borwein scaling resolves an ill-conditioned diagonal quadratic',()=>{const p={dimension:2,f:([x,y])=>x*x+500*y*y,g:([x,y])=>[2*x,1000*y]},r=spectralGradient(p,[10,10],{maxIterations:1000,gtol:1e-6});assert.equal(r.status,'converged');assert(r.f<1e-10);assert(r.trace.every(t=>(t.nextSpectralStep??1)>0));});
