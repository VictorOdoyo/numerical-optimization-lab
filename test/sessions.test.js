import test from 'node:test';
import assert from 'node:assert/strict';

import {validateSession,encodeSession,decodeSession} from '../src/sessions.js';
test('session interchange validates version dimensions methods and numerical options before replay',()=>{const s=validateSession({version:1,problem:'rosenbrock',method:'bfgs'});assert.deepEqual(decodeSession(encodeSession(s)),s);assert.throws(()=>validateSession({...s,method:'projected'}));assert.throws(()=>validateSession({...s,start:[1]}));assert.throws(()=>validateSession({...s,options:{gtol:NaN}}));assert.throws(()=>decodeSession('{"version":2}'));});
