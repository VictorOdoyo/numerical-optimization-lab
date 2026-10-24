# Explore convergence

Start with Rosenbrock and BFGS. The blue marker is the initial point, orange marks the stored trajectory. Click the landscape to choose a new start. Run optimization to compute a new trace. Replay and the slider inspect completed iterates; computation is not streamed.

Compare compatible methods uses the same initial point and settings. Convergence shows logarithmic objective gap to a known benchmark reference, or the lowest observed trace value when a reference is unavailable. A clipped plot floor is not an optimality certificate. Iteration trace shows the last 200 rows; CSV contains every stored row.

Box and triangle cases show constraint geometry. Sparse regression displays coefficients rather than a misleading two-dimensional projection. ADMM and active-set QP use structured iteration/residual budgets, so the callback-budget control is disabled. Robust exponential fitting exposes the residual loss selector.

Save session preserves the problem, method, start, seed, penalty, loss and solver settings. Open experiment validates a JSON document before replacing the active session. Advanced imported settings remain preserved when resaving; changing methods resets those extras. Download result saves final coordinates, summaries and traces.
