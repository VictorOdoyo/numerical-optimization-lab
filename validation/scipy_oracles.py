"""Independent SciPy/NumPy references; no production implementation is imported into Python."""
import json, os, subprocess
from pathlib import Path
import numpy as np
import scipy
from scipy.optimize import minimize, rosen, rosen_der, LinearConstraint, Bounds

root = Path(__file__).resolve().parents[1]
cases = json.loads(subprocess.check_output([os.environ.get('NODE_BINARY', 'node'), str(root / 'scripts/oracle-cases.mjs')], cwd=root, text=True))
for case in cases:
    kind = case['type']
    if kind == 'rosenbrock':
        ref = minimize(rosen, [-1.2, 1.], jac=rosen_der, method='BFGS', options={'gtol': 1e-9})
        assert np.linalg.norm(np.array(case['result']['x']) - ref.x) < 2e-5, case
        assert case['result']['f'] < 1e-10, case
    elif kind == 'quadratic':
        Q, c = np.array(case['Q']), np.array(case['c'])
        ref = np.linalg.solve(Q, -c)
        assert np.linalg.norm(np.array(case['result']['x']) - ref) < 1e-6, case
    elif kind == 'least-squares':
        ref = np.linalg.lstsq(case['A'], case['b'], rcond=None)[0]
        assert np.linalg.norm(np.array(case['x']) - ref) < 1e-9
    elif kind == 'lasso':
        A, b, lam = np.array(case['A']), np.array(case['b']), case['lambda']
        n = A.shape[1]
        def fun(v):
            residual = A @ v[:n] - b
            return .5 * residual @ residual + lam * np.sum(v[n:])
        def jac(v):
            return np.r_[A.T @ (A @ v[:n] - b), np.full(n, lam)]
        C = np.vstack([np.c_[-np.eye(n), np.eye(n)], np.c_[np.eye(n), np.eye(n)]])
        ref = minimize(fun, np.zeros(2*n), jac=jac, method='SLSQP', constraints=[LinearConstraint(C, 0, np.inf)], options={'ftol': 1e-12, 'maxiter': 1000})
        assert ref.success, ref.message
        assert abs(case['result']['f'] - ref.fun) < 1e-7
        assert np.linalg.norm(np.array(case['result']['x']) - ref.x[:n]) < 2e-5
    elif kind in ('inequality', 'equality'):
        Q, c = np.array(case['Q']), np.array(case['c'])
        A = np.array(case['G'] if kind == 'inequality' else case['A'])
        b = np.array(case['h'] if kind == 'inequality' else case['b'])
        constraint = LinearConstraint(A, -np.inf if kind == 'inequality' else b, b)
        ref = minimize(lambda x: .5*x@Q@x+c@x, np.zeros(len(c)), jac=lambda x: Q@x+c, method='SLSQP', constraints=[constraint], options={'ftol': 1e-12, 'maxiter': 1000})
        assert ref.success, ref.message
        assert np.linalg.norm(np.array(case['result']['x']) - ref.x) < 1e-6, case
    elif kind == 'eigen':
        assert np.linalg.norm(np.linalg.eigvalsh(case['A']) - case['result']['values']) < 1e-9
    else:
        raise AssertionError(kind)
print(json.dumps({'oracleCases': len(cases), 'numpy': np.__version__, 'scipy': scipy.__version__, 'status': 'passed'}))
