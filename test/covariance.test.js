import test from 'node:test';
import assert from 'node:assert/strict';

import {covariance} from '../src/covariance.js';
test('local uncertainty matches inverse information and marks unidentifiable models',()=>{const c=covariance([[1,0],[0,2]],{variance:4});assert(c.identifiable);assert(Math.abs(c.standardErrors[0]-2)<1e-12);assert(Math.abs(c.standardErrors[1]-1)<1e-12);const d=covariance([[1,2],[2,4]]);assert.equal(d.rank,1);assert.equal(d.standardErrors,null);assert.equal(d.condition,Infinity);});
