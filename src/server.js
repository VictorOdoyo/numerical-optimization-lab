import http from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
export function createServer() {
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self'; worker-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    );
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end();
      return;
    }
    try {
      const url = new URL(req.url, 'http://localhost');
      let name = decodeURIComponent(url.pathname);
      if (name === '/') name = '/web/index.html';
      if (!/^\/(web|src)\/[a-zA-Z0-9_./-]+$/.test(name) || name.split('/').includes('..'))
        throw Error('Not allowed');
      const target = path.resolve(root, '.' + name),
        actual = await realpath(target);
      if (
        !actual.startsWith(root + path.sep) ||
        !['.js', '.css', '.html', '.svg'].includes(path.extname(actual))
      )
        throw Error('Not allowed');
      const data = await readFile(actual),
        type = {
          '.js': 'text/javascript',
          '.css': 'text/css',
          '.html': 'text/html',
          '.svg': 'image/svg+xml',
        }[path.extname(actual)];
      res.writeHead(200, { 'Content-Type': type + '; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });
}
