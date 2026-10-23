import test from 'node:test';
import assert from 'node:assert/strict';

import {diagnose} from '../src/diagnostics.js';import {quadraticProblem} from '../src/quadratic-problem.js';
test('stationarity diagnostics distinguish minima from stationary negative curvature',()=>{const a=diagnose(quadraticProblem([[2,0],[0,8]],[0,0]),[0,0]);assert.equal(a.classification,'strict-local-minimum-candidate');assert.equal(a.condition,4);const b=diagnose(quadraticProblem([[2,0],[0,-1]],[0,0]),[0,0]);assert.equal(b.classification,'stationary-with-negative-curvature');assert.equal(diagnose(quadraticProblem([[2,0],[0,8]],[0,0]),[1,1]).classification,'nonstationary');});
