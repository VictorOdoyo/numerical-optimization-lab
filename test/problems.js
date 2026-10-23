export const quadratic={dimension:2,f:([x,y])=>(x-3)**2+4*(y+2)**2,g:([x,y])=>[2*(x-3),8*(y+2)],H:()=>[[2,0],[0,8]]};
export const rosenbrock={dimension:2,f:([x,y])=>(1-x)**2+100*(y-x*x)**2,g:([x,y])=>[-2*(1-x)-400*x*(y-x*x),200*(y-x*x)],H:([x,y])=>[[2-400*y+1200*x*x,-400*x],[-400*x,200]]};
