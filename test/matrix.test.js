import test from 'node:test';
import assert from 'node:assert/strict';

import {identity,matMul,matVec,transpose,symmetric} from '../src/matrix.js';
test('matrix products obey transpose duality and identity',()=>{const A=[[1,2,3],[4,5,6]],B=[[2,1],[0,-1],[3,2]];assert.deepEqual(matMul(A,B),[[11,5],[26,11]]);assert.deepEqual(transpose(matMul(A,B)),matMul(transpose(B),transpose(A)));assert.deepEqual(matMul(A,identity(3)),A);assert.deepEqual(matVec(A,[1,0,-1]),[-2,-2]);assert(!symmetric([[1,2],[3,4]]));});
