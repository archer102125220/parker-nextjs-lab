import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { IncomingMessage } from 'http';

/**
 * WebSocket Server Singleton
 *
 * Standalone WebSocket server for native WebSocket tests.
 * Runs on a separate port (default 3003) to avoid conflicts with Socket.IO.
 */

const globalForWebSocket = globalThis as unknown as {
  wss: WebSocketServer | undefined;
};

export function getWebSocketServer(): WebSocketServer | null {
  return globalForWebSocket.wss ?? null;
}

function getSSLOptions(): { key: Buffer; cert: Buffer } | null {
  if (process.env.NODE_ENV === 'production') {
    return null; // Production handling usually done by reverse proxy
  }

  const devKeyPath = join(process.cwd(), 'certificates', 'localhost-key.pem');
  const devCertPath = join(process.cwd(), 'certificates', 'localhost.pem');

  if (existsSync(devKeyPath) && existsSync(devCertPath)) {
    console.log('[WebSocket] Using development SSL certificates');
    return {
      key: readFileSync(devKeyPath),
      cert: readFileSync(devCertPath)
    };
  }
  return null;
}

export function initializeWebSocketServer(
  port: number = 3003
): WebSocketServer {
  if (globalForWebSocket.wss) {
    console.log('[WebSocket] Server already initialized');
    return globalForWebSocket.wss;
  }

  const sslOptions = getSSLOptions();
  const isHttps = sslOptions !== null;

  const server = isHttps ? createHttpsServer(sslOptions) : createHttpServer();

  const wss = new WebSocketServer({ server });

  server.listen(port, () => {
    console.log(
      `[WebSocket] Server started on ${isHttps ? 'wss' : 'ws'}://localhost:${port}`
    );
  });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    console.log(
      `[WebSocket] Client connected from ${req.socket.remoteAddress}`
    );

    ws.on('message', (message) => {
      console.log({ message });
      console.log(`[WebSocket] Received: ${message.toString()}`);
      // Echo back
      ws.send(message.toString());

      try {
        // Try to handle JSON messages if needed (e.g. for specific test cases)
        const data = JSON.parse(message.toString());
        if (data.type === 'test') {
          ws.send(JSON.stringify({ type: 'test-response', received: data }));
        }
      } catch {
        // Not JSON, ignore
      }
    });

    ws.on('close', () => {
      console.log('[WebSocket] Client disconnected');
    });

    ws.on('error', (err) => {
      console.error('[WebSocket] Error:', err);
    });
  });

  globalForWebSocket.wss = wss;
  return wss;
}

export function closeWebSocketServer(): Promise<void> {
  return new Promise((resolve) => {
    if (globalForWebSocket.wss) {
      globalForWebSocket.wss.close(() => {
        console.log('[WebSocket] Server closed');
        globalForWebSocket.wss = undefined;
        resolve();
      });
    } else {
      resolve();
    }
  });
}
