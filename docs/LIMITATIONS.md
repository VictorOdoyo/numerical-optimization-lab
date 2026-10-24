# Scope and limits

This is an educational dense numerical laboratory, not a certified general-purpose optimizer. Floating-point conditioning, nonsmoothness, invalid derivatives and domain restrictions can prevent convergence. Nonconvex results are local. Do not interpret plots or stopping labels as global certificates.

Dense dimensions are capped at 256, autodiff at 32, Nelder-Mead at 16, active-set QP at 32 variables/64 inequalities, and regression design columns at 32. Iterations are capped at 5000 for most iterative methods and callback budgets at one million. Browser jobs are cancelled after 30 seconds. Queued work is cancelled by terminating its worker.

Active-set QPs require SPD curvature and a feasible start. Equality constraints must have independent rows. Proximal methods assume a suitable smooth gradient and L1 penalty. ADMM targets LASSO only. LM uses a weighted Gauss-Newton approximation rather than an exact robust Hessian. Covariance uses local linearization and normal-equation information spectra.

Traces count outer iterations, including rejected trust/damping steps. Callback counters count actual f/g/H callbacks, including numerical-difference calls, not floating-point operations or residual-level work. Residual adapters additionally expose their own counters. Structured QP/ADMM methods report residual evidence and may omit callback counters. Surface grids and contours are approximations, not extra solver iterates.
