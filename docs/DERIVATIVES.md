# Derivatives and conditioning

Finite gradients use symmetric central differences with a relative cube-root-epsilon step. Jacobians use the same scheme. Hessians use differentiated analytical gradients when available, otherwise second-order objective differences. Domain boundaries and severe scaling can invalidate these approximations.

The autodiff namespace supports second-order forward jets with plus/minus/times/divide, powers, exp/log, sin/cos and differentiate. Jet expressions use these operations rather than JavaScript arithmetic operators. Constant and linear powers at zero have explicit derivative rules. Dimensions are capped at 32 because second-order storage grows quadratically.

Householder QR avoids forming normal equations for least-squares solves. Cholesky rejects non-SPD matrices. LU uses scaled partial pivoting. Jacobi eigensystems expose convergence. covariance deliberately forms an information matrix and documents its rank/conditioning limitations.

scaledProblem applies reversible positive variable scaling and exact derivative chain rules. checkGradient compares analytical and central derivatives. A derivative comparison is diagnostic evidence at sampled points, not a symbolic proof.
