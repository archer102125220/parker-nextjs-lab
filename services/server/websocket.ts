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
 *
 * 支援的訊息類型：
 * - { type: 'broadcast', data: any } - 廣播給所有連線
 * - { type: 'room', room: string, data: any } - 推送給特定房間
 * - { type: 'joinRoom', room: string } - 加入房間
 * - { type: 'leaveRoom', room: string } - 離開房間
 * - 其他 - 只回傳給發送者
 */

const globalForWebSocket = globalThis as unknown as {
  wss: WebSocketServer | undefined;
  rooms: Map<string, Set<WebSocket>> | undefined;
  clientRooms: Map<WebSocket, Set<string>> | undefined;
};

export function getWebSocketServer(): WebSocketServer | null {
  return globalForWebSocket.wss ?? null;
}

function getSSLOptions(): { key: Buffer; cert: Buffer } | null {
  if (process.env.NODE_ENV === 'production') {
    return null;
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

// 房間管理函式
function joinRoom(ws: WebSocket, roomName: string): void {
  if (!globalForWebSocket.rooms) {
    globalForWebSocket.rooms = new Map();
  }
  if (!globalForWebSocket.clientRooms) {
    globalForWebSocket.clientRooms = new Map();
  }

  // 將 client 加入房間
  if (!globalForWebSocket.rooms.has(roomName)) {
    globalForWebSocket.rooms.set(roomName, new Set());
  }
  globalForWebSocket.rooms.get(roomName)!.add(ws);

  // 記錄 client 所屬的房間
  if (!globalForWebSocket.clientRooms.has(ws)) {
    globalForWebSocket.clientRooms.set(ws, new Set());
  }
  globalForWebSocket.clientRooms.get(ws)!.add(roomName);

  console.log(`[WebSocket] Client joined room: ${roomName}`);
}

function leaveRoom(ws: WebSocket, roomName: string): void {
  if (globalForWebSocket.rooms?.has(roomName)) {
    globalForWebSocket.rooms.get(roomName)!.delete(ws);
    if (globalForWebSocket.rooms.get(roomName)!.size === 0) {
      globalForWebSocket.rooms.delete(roomName);
    }
  }
  globalForWebSocket.clientRooms?.get(ws)?.delete(roomName);
  console.log(`[WebSocket] Client left room: ${roomName}`);
}

function leaveAllRooms(ws: WebSocket): void {
  const rooms = globalForWebSocket.clientRooms?.get(ws);
  if (rooms) {
    rooms.forEach((roomName) => {
      globalForWebSocket.rooms?.get(roomName)?.delete(ws);
      if (globalForWebSocket.rooms?.get(roomName)?.size === 0) {
        globalForWebSocket.rooms.delete(roomName);
      }
    });
    globalForWebSocket.clientRooms?.delete(ws);
  }
}

function broadcastToRoom(roomName: string, message: string): void {
  const room = globalForWebSocket.rooms?.get(roomName);
  if (room) {
    room.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

function broadcastToAll(wss: WebSocketServer, message: string): void {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export function initializeWebSocketServer(
  port: number = 3003
): WebSocketServer {
  if (globalForWebSocket.wss) {
    console.log('[WebSocket] Server already initialized');
    return globalForWebSocket.wss;
  }

  // 初始化房間管理
  globalForWebSocket.rooms = new Map();
  globalForWebSocket.clientRooms = new Map();

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
      const messageStr = message.toString();
      console.log(`[WebSocket] Received: ${messageStr}`);

      try {
        const data = JSON.parse(messageStr);

        // 先檢查特殊的系統事件
        if (data.event === 'joinRoom' && data.room) {
          joinRoom(ws, data.room);
          ws.send(
            JSON.stringify({
              type: 'private',
              event: 'joinedRoom',
              room: data.room,
              data: { success: true }
            })
          );
          return;
        }

        if (data.event === 'leaveRoom' && data.room) {
          leaveRoom(ws, data.room);
          ws.send(
            JSON.stringify({
              type: 'private',
              event: 'leftRoom',
              room: data.room,
              data: { success: true }
            })
          );
          return;
        }

        // 根據 type 決定傳送方式
        switch (data.type) {
          case 'broadcast':
            // 廣播給所有連線
            broadcastToAll(wss, messageStr);
            break;

          case 'room':
            // 推送給特定房間
            if (data.room) {
              broadcastToRoom(data.room, messageStr);
            } else {
              ws.send(
                JSON.stringify({
                  type: 'private',
                  event: 'error',
                  data: { message: 'Room name required' }
                })
              );
            }
            break;

          case 'private':
          default:
            // 私人訊息，只回傳給發送者
            ws.send(messageStr);
            break;
        }
      } catch {
        // 非 JSON，只回傳給發送者
        ws.send(messageStr);
      }
    });

    ws.on('close', () => {
      leaveAllRooms(ws);
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
        globalForWebSocket.rooms = undefined;
        globalForWebSocket.clientRooms = undefined;
        resolve();
      });
    } else {
      resolve();
    }
  });
}

