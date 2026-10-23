import {same,finite} from './validation.js';
export function dot(a,b){same(a,b);let sum=0,c=0;for(let i=0;i<a.length;i++){const y=a[i]*b[i]-c,t=sum+y;c=(t-sum)-y;sum=t;}return sum;}
export function norm(a){let scale=0,ssq=1;for(const value of a){const v=Math.abs(value);if(v===0)continue;if(scale<v){ssq=1+ssq*(scale/v)**2;scale=v;}else ssq+=(v/scale)**2;}return scale===0?0:scale*Math.sqrt(ssq);}
export function infNorm(a){let n=0;for(const v of a)n=Math.max(n,Math.abs(v));return n;}
export function add(a,b,alpha=1){same(a,b);return a.map((x,i)=>x+alpha*b[i]);}
export function scale(a,s){finite(s);return a.map(v=>v*s);}
export function distance(a,b){return norm(add(a,b,-1));}
export function outer(a,b){return a.map(x=>b.map(y=>x*y));}
export function zeros(n){return Array(n).fill(0);}
