# Interpret the evidence

Smooth methods check the infinity norm of the gradient. A small gradient is stationarity, not a global-minimum proof. diagnose also checks Hessian eigenvalues: positive curvature gives a strict local-minimum candidate, negative curvature identifies a stationary point that is not a local minimum, and semidefinite curvature is inconclusive.

At a constrained optimum, the raw gradient may be nonzero. Box methods report a projected mapping. Proximal methods report an L1 proximal mapping. QPs report primal/dual residuals and multipliers. ADMM reports primal and dual residuals with absolute/relative thresholds. Compare the measure appropriate to the method, not a common green label alone.

Small steps with a large optimality measure produce stagnated rather than converged. Evaluation and iteration budgets are separate limits. Derivative-free convergence refers to geometric criteria. Different stopping tests can yield different iteration counts and precision.

Covariance is a local linearized estimate under supplied noise variance. Pseudoinverse values in rank-deficient directions are not finite uncertainty; standard errors are omitted when the model is unidentifiable.
