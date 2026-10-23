import test from 'node:test';
import assert from 'node:assert/strict';

import {robustLoss} from '../src/robust-loss.js';
test('robust scores match finite derivatives and suppress outlier influence',()=>{for(const loss of['linear','huber','soft-l1','cauchy'])for(const r of[-4,-.3,0,.3,4]){const h=1e-5,a=robustLoss(r,{loss}),numeric=(robustLoss(r+h,{loss}).cost-robustLoss(r-h,{loss}).cost)/(2*h);assert(Math.abs(a.psi-numeric)<1e-8);assert(a.weight>=0);assert(Math.abs(a.psi-r*a.weight)<1e-12);}assert(robustLoss(100,{loss:'huber'}).psi<2);});
