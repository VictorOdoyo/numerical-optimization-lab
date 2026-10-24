# API contracts

Import from src/index.js. Dense vectors are arrays, matrices are arrays of rows. Numeric inputs must be finite and dimensionally compatible. Most dense operations are limited to 256 dimensions; specialized methods impose smaller bounds.

Smooth problem objects contain dimension, f(x), optional g(x), and optional H(x). Missing derivatives use central differences. Solvers accept maxIterations, maxEvaluations, gtol, xtol, ftol, signal and onIteration where supported. Each method validates extra options. L-BFGS accepts memory; Adam accepts learningRate/beta1/beta2; trust regions accept initialRadius/maxRadius; derivative-free methods accept initialStep.

Results contain x, f, status, message, iterations, trace and evaluation counters where applicable. Status can be converged, max_iterations, max_evaluations, line_search_failed, stagnated, cancelled, model_failed or numerical_error. Structured QP direct solves return solved. Exceptions remain appropriate for invalid inputs or malformed callback outputs.

createCase and solveCase dispatch catalog experiments. compareMethods isolates incompatible cases; multiStart reports the best observed local result. sampleSurface and contours support bounded plots. encodeSession/decodeSession exchange version-1 experiments; resultJSON and traceCSV export results.

Linear algebra exports solve/luFactor/luSolve, cholesky/choleskySolve, qr/leastSquares, eigenSymmetric, conjugateGradient and steihaug. Constraints export boxProject/simplexProject/l1Project/l2Project/softThreshold, projectedGradient, equalityQP and activeSetQP. Sparse APIs include proximalGradient/fista and lassoADMM. leastSquaresProblem adapts residual/Jacobian callbacks; levenbergMarquardt fits it. covariance returns local linearized uncertainty with explicit rank diagnostics.
