import { validateSession } from './sessions.js';
import { createCase } from './catalog.js';
import { solveCase } from './minimize.js';
import { compareMethods } from './comparison.js';
import { sampleSurface } from './surface.js';
import { contours } from './contours.js';
import { diagnose } from './diagnostics.js';
import { requireThat } from './validation.js';
export function executeRequest(request) {
  requireThat(Number.isSafeInteger(request?.id) && request.id >= 0, 'Invalid request identifier');
  const session = validateSession(request.session),
    c = createCase(session.problem, session);
  if (request.type === 'solve') {
    const result = solveCase(c, session.method, { start: session.start, options: session.options });
    return {
      result,
      diagnostics:
        c.meta.task === 'smooth' && result.x.length
          ? diagnose(c.problem, result.x, { gradientTolerance: session.options.gtol ?? 1e-6 })
          : null,
    };
  }
  if (request.type === 'compare')
    return compareMethods(session.problem, request.methods, {
      ...session,
      options: session.options,
    });
  if (request.type === 'surface') {
    if (!c.meta.domain) return null;
    const surface = sampleSurface(c.problem, c.meta.domain, { resolution: 65 }),
      span = surface.maximum - surface.minimum,
      levels = Array.from(
        { length: 12 },
        (_, i) => surface.minimum + (span * (10 ** ((i + 1) / 12) - 1)) / 9,
      );
    return {
      surface,
      contours: contours(surface, levels),
      bounds: c.meta.bounds ?? null,
      data: c.meta.task === 'fit' ? c.data : null,
    };
  }
  throw new Error('Unknown worker request');
}
export function respond(request) {
  try {
    return { id: request?.id, ok: true, result: executeRequest(request) };
  } catch (error) {
    return { id: request?.id, ok: false, error: error.message, code: error.code ?? 'ERROR' };
  }
}
