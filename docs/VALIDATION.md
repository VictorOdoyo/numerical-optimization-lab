# Verification

Tests independently check matrix reconstruction/residuals, secant equations, finite-difference derivatives, known minimizers, Hessian curvature, constrained stationarity and L1 subgradient conditions. Triangle QPs are compared with geometric edge/vertex enumeration. Random SPD problems are compared with closed-form stationary solutions. Robust fits are checked against known contaminated-data parameters.

Pinned SciPy 1.17.1 and NumPy 2.4.3 independently compare 14 cases: nonlinear minimization, random quadratics, linear least squares, epigraph LASSO via SLSQP, equality/inequality QPs and eigenvalues. The Python code imports no production algorithm implementation.

Browser tests use real module workers for solving, comparison, scrubbing, certificates, advanced session round trips, invalid imports, budgets, cancellation and responsive layout. The benchmark checks 36 seeded smooth solves against analytical objective tolerances. Clean-package verification installs the TGZ without development dependencies and executes a solver and required browser assets.

CI runs Node 24 on Windows and Linux, Chromium on Linux, and isolated Python numerical references. Tests are evidence for their sampled domains, not a universal proof of numerical robustness.
