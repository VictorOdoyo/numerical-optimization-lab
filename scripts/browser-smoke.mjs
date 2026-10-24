import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
import { createServer } from '../src/server.js';
const { chromium } = createRequire(import.meta.url)('playwright'),
  server = createServer();
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port,
  browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}),
  }),
  page = await browser.newPage({ viewport: { width: 1440, height: 1100 } }),
  errors = [];
page.on('pageerror', (e) => errors.push(e.message));
let checks = 0;
const check = (value, label) => {
    assert(value, label);
    checks++;
  },
  wait = (fn) => page.waitForFunction(fn, null, { timeout: 20000 }),
  idle = () => wait(() => !document.querySelector('#run').disabled);
try {
  await page.goto(base);
  await wait(() => document.querySelector('#status-badge').textContent === 'CONVERGED');
  await wait(() => document.querySelector('#surface-count').textContent.includes('4225'));
  check(
    (await page.locator('#certificate').innerText()).includes('local minimum'),
    'local curvature evidence',
  );
  await page.locator('#compare').click();
  await wait(() => document.querySelector('#status').textContent.startsWith('Comparison complete'));
  check((await page.locator('.comparison-row').count()) === 4, 'comparison methods');
  await page.locator('[data-tab="convergence"]').click();
  check((await page.locator('#convergence-chart svg').count()) === 1, 'convergence graph');
  await page.locator('[data-tab="trace"]').click();
  check((await page.locator('#trace-table tbody tr').count()) > 10, 'trace rows');
  await page.locator('[data-tab="landscape"]').click();
  await page.locator('#timeline').fill('35');
  check((await page.locator('#frame-label').innerText()).includes('k'), 'replay scrubbing');
  const csv = page.waitForEvent('download');
  await page.locator('#export-trace').click();
  check((await csv).suggestedFilename() === 'contour-trace.csv', 'trace export');
  const saved = page.waitForEvent('download');
  await page.locator('#save').click();
  check(
    JSON.parse(readFileSync(await (await saved).path(), 'utf8')).version === 1,
    'session export',
  );
  await page.locator('#problem').selectOption('box');
  await idle();
  await wait(() => document.querySelector('#status-badge').textContent === 'CONVERGED');
  check(
    (await page.locator('#certificate').innerText()).includes('Projected'),
    'constrained certificate',
  );
  await page.locator('#problem').selectOption('triangle-qp');
  await idle();
  await wait(() => document.querySelector('#status-badge').textContent === 'CONVERGED');
  check((await page.locator('#certificate').innerText()).includes('dual'), 'QP certificate');
  await page.locator('#problem').selectOption('lasso');
  await idle();
  await page.locator('#method').selectOption('admm');
  await page.locator('#run').click();
  await idle();
  check((await page.locator('#certificate').innerText()).includes('dual'), 'ADMM residuals');
  check(await page.locator('#evaluations').isDisabled(), 'ADMM callback budget distinction');
  await page.locator('#problem').selectOption('decay');
  await idle();
  await wait(() => document.querySelector('#status-badge').textContent === 'CONVERGED');
  check(await page.locator('#loss').isVisible(), 'robust fit controls');
  const imported = {
    version: 1,
    problem: 'rosenbrock',
    method: 'lbfgs',
    start: [-1.2, 1],
    seed: 42,
    lambda: 0.05,
    loss: 'huber',
    options: { maxIterations: 1000, gtol: 1e-6, memory: 2 },
  };
  await page
    .locator('#file')
    .setInputFiles({
      name: 'case.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(imported)),
    });
  await wait(() => document.querySelector('#status').textContent.startsWith('Experiment imported'));
  await page.locator('#run').click();
  await idle();
  check((await page.locator('#status-badge').innerText()) === 'CONVERGED', 'imported solver');
  const roundTrip = page.waitForEvent('download');
  await page.locator('#save').click();
  check(
    JSON.parse(readFileSync(await (await roundTrip).path(), 'utf8')).options.memory === 2,
    'advanced option fidelity',
  );
  await page
    .locator('#file')
    .setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{bad') });
  await wait(() => document.querySelector('#status').dataset.error === 'true');
  check(
    (await page.locator('#method').inputValue()) === 'lbfgs',
    'invalid import preserves experiment',
  );
  await page.locator('#evaluations').fill('4');
  await page.locator('#evaluations').dispatchEvent('change');
  await page.locator('#run').click();
  await idle();
  check(
    (await page.locator('#status-badge').innerText()) === 'MAX EVALUATIONS',
    'honest evaluation budget',
  );
  await page.evaluate(() => {
    document.querySelector('#run').click();
    document.querySelector('#cancel').click();
  });
  check((await page.locator('#status').innerText()) === 'Computation cancelled.', 'cancellation');
  await page.locator('#evaluations').fill('50000');
  await page.locator('#evaluations').dispatchEvent('change');
  await page.locator('#run').click();
  await idle();
  mkdirSync('results', { recursive: true });
  await page.screenshot({ path: 'results/desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  check(
    !(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)),
    'mobile overflow',
  );
  await page.screenshot({ path: 'results/mobile.png', fullPage: true });
  check(errors.length === 0, 'no page errors');
  console.log(JSON.stringify({ browserChecks: checks, pageErrors: errors }, null, 2));
} finally {
  await browser.close();
  server.closeAllConnections();
  await new Promise((r) => server.close(r));
}
