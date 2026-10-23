import {vector,matrix,finite,integer,requireThat,NumericError} from './validation.js';import {finiteGradient,finiteHessian} from './differences.js';
export class Evaluator{
 constructor(problem,{maxEvaluations=50000,signal}={}){requireThat(problem&&typeof problem.f==='function','Problem needs f(x)');integer(problem.dimension,'dimension',1,256);integer(maxEvaluations,'maxEvaluations',1,1000000);this.problem=problem;this.maxEvaluations=maxEvaluations;this.signal=signal;this.counts={f:0,g:0,H:0,calls:0};}
 charge(){if(this.signal?.aborted)throw new NumericError('CANCELLED','Computation cancelled');if(this.counts.calls>=this.maxEvaluations)throw new NumericError('BUDGET','Evaluation budget exhausted');this.counts.calls++;}
 point(x){const v=vector(x);requireThat(v.length===this.problem.dimension,'Point dimension mismatch');return v;}
 f(x){const point=this.point(x);this.charge();this.counts.f++;const value=this.problem.f(point);requireThat(Number.isFinite(value),'Objective is nonfinite','NONFINITE');return value;}
 g(x){const point=this.point(x);this.counts.g++;let v;if(this.problem.g){this.charge();v=this.problem.g(point);}else v=finiteGradient(p=>this.f(p),point);v=vector(v,'Gradient');requireThat(v.length===point.length,'Gradient dimension mismatch');return v;}
 H(x){const point=this.point(x);this.counts.H++;let A;if(this.problem.H){this.charge();A=this.problem.H(point);}else A=finiteHessian(p=>this.f(p),point,{gradient:this.problem.g?p=>this.g(p):undefined});A=matrix(A,'Hessian');requireThat(A.length===point.length&&A[0].length===point.length,'Hessian dimension mismatch');return A;}
}
