import { vector, matrix, requireThat } from './validation.js';
import { finiteJacobian } from './differences.js';
import { robustLoss } from './robust-loss.js';
export function leastSquaresProblem({ dimension, residual, jacobian, loss = 'linear', scale = 1 }) {
  requireThat(typeof residual === 'function', 'Residual callback is required');
  const counts = { residual: 0, jacobian: 0 };
  const values = (x) => {
    counts.residual++;
    return vector(residual([...x]), 'Residual', { max: 256 });
  };
  const model = (x) => {
    const r = values(x);
    let J;
    if (jacobian) {
      counts.jacobian++;
      J = matrix(jacobian([...x]), 'Jacobian');
    } else {
      counts.jacobian++;
      J = finiteJacobian(values, x);
    }
    requireThat(J.length === r.length && J[0].length === dimension, 'Jacobian dimensions differ');
    const terms = r.map((v) => robustLoss(v, { loss, scale }));
    return { r, J, terms };
  };
  return {
    dimension,
    counts,
    residual: values,
    jacobian: (x) => model(x).J,
    f: (x) => values(x).reduce((sum, v) => sum + robustLoss(v, { loss, scale }).cost, 0),
    g: (x) => {
      const { J, terms } = model(x);
      return Array.from({ length: dimension }, (_, j) =>
        J.reduce((sum, row, i) => sum + row[j] * terms[i].psi, 0),
      );
    },
    H: (x) => {
      const { J, terms } = model(x);
      return Array.from({ length: dimension }, (_, j) =>
        Array.from({ length: dimension }, (_, k) =>
          J.reduce((sum, row, i) => sum + terms[i].weight * row[j] * row[k], 0),
        ),
      );
    },
    hessianModel: 'weighted-gauss-newton',
  };
}
