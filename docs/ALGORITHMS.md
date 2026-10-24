# Numerical methods

Gradient descent uses Armijo backtracking. Spectral gradient chooses Barzilai-Borwein steps with a ten-value nonmonotone reference. Nonlinear CG uses PR+ directions, periodic restarts and strong-Wolfe curvature. BFGS applies an inverse rank-two secant update and skips/reset unsafe curvature. L-BFGS uses a bounded two-loop history.

Modified Newton shifts Hessians until Cholesky succeeds, with steepest-descent fallback. Trust-region Newton-CG uses Steihaug truncated CG, boundary intersection and negative-curvature handling. Acceptance uses actual/predicted reduction. Adam uses bias-corrected moments and deterministic gradients; it is not promised to converge on every case.

Nelder-Mead supports reflection, expansion, inside/outside contraction and shrink. It terminates using simplex diameter and objective spread. Pattern search polls coordinate directions, attempts pattern extrapolation and refines its mesh. Neither reports a gradient certificate.

Projected gradient checks a box projection mapping. ISTA/FISTA check proximal mappings; FISTA restarts after objective increases. ADMM splits LASSO into a factored quadratic solve and soft thresholding, with primal/dual stopping tolerances and scaled-dual updates when rho changes.

LM uses weighted Gauss-Newton curvature, adaptive damping and model agreement. Active-set QP requires a feasible initial point and SPD curvature, activates blocking inequalities and releases negative multipliers. Equality QP solves a checked saddle-point KKT system.

References: [SciPy optimization documentation](https://docs.scipy.org/doc/scipy/tutorial/optimize.html), [Boyd et al., ADMM](https://stanford.edu/~boyd/papers/admm_distr_stats.html). Code is original educational implementation; references do not imply performance equivalence.
