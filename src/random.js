import {integer} from './validation.js';
export function random(seed=42){integer(seed,'seed',0,4294967295);let s=(seed>>>0)||0x9e3779b9;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296;};}
export function normal(rng){let spare=null;return()=>{if(spare!==null){const z=spare;spare=null;return z;}const r=Math.sqrt(-2*Math.log(Math.max(Number.MIN_VALUE,rng()))),theta=2*Math.PI*rng();spare=r*Math.sin(theta);return r*Math.cos(theta);};}
