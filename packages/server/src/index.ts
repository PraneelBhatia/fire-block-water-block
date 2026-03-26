import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { GameRoom } from './GameRoom.js';
import { getRoomIdByCode } from './roomCodes.js';

const port = Number(process.env.PORT) || 2567;

// Static file serving for production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = path.join(__dirname, '..', 'public');
const hasStaticFiles = fs.existsSync(path.join(STATIC_DIR, 'index.html'));

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function serveStatic(req: http.IncomingMessage, res: http.ServerResponse): boolean {
  if (!hasStaticFiles) return false;
  let urlPath = req.url?.split('?')[0] ?? '/';
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(STATIC_DIR, urlPath);
  // Prevent directory traversal
  if (!filePath.startsWith(STATIC_DIR)) return false;
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return false;
  const ext = path.extname(filePath);
  res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
  res.writeHead(200);
  fs.createReadStream(filePath).pipe(res);
  return true;
}

const httpServer = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Room code lookup endpoint
  const match = req.url?.match(/^\/api\/room-by-code\/([A-Z0-9]+)$/);
  if (match && req.method === 'GET') {
    const code = match[1];
    const roomId = getRoomIdByCode(code);

    res.setHeader('Content-Type', 'application/json');

    if (roomId) {
      res.writeHead(200);
      res.end(JSON.stringify({ roomId }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Room not found' }));
    }
    return;
  }

  // Serve static files (production)
  if (serveStatic(req, res)) return;

  // SPA fallback — serve index.html for unmatched routes
  if (hasStaticFiles) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    fs.createReadStream(path.join(STATIC_DIR, 'index.html')).pipe(res);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});

gameServer.define('game', GameRoom);

gameServer.listen(port).then(() => {
  console.log(`Game server listening on port ${port}`);
});
