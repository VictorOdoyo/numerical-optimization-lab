# Reproducibility

Catalog cases include Rosenbrock, Himmelblau, Rastrigin, Beale, Booth, an ill-conditioned bowl, a box problem, robust decay fitting, LASSO and a triangle QP. Data generators use isolated seeded xorshift/Box-Muller streams. Controlled-condition regression uses orthogonal factors and specified singular values.

Comparisons use the same problem/start/settings. ADMM honors supplied initial coefficients but has a structured residual budget rather than callback accounting. A shared callback budget is not an equal arithmetic-work budget across methods. Timing includes solver work and excludes surface sampling and post-solve diagnostics.

MultiStart samples a declared domain and reports local outcomes; it is not a global optimizer certificate. Parameter studies are bounded. Runtime timings vary by platform, scheduler and JIT state. Reproduce coordinates, objectives, statuses and traces within numerical tolerances, not exact milliseconds.
