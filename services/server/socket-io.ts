import { Server as SocketIOServer } from 'socket.io';
import { createServer as createHttpServer, Server as HttpServer } from 'http';
import {
  createServer as createHttpsServer,
  Server as HttpsServer
} from 'https';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Socket.IO Server Singleton
 *
 * 用於在 Next.js 中共享 Socket.IO 伺服器實例
 * 注意：此方案僅適用於本地開發環境
 * Vercel 等 serverless 環境不支援 WebSocket
 */

// 使用 globalThis 來確保 hot reload 時不會重新建立實例
const globalForSocketIO = globalThis as unknown as {
  socketIO: SocketIOServer | undefined;
  httpServer: HttpServer | HttpsServer | undefined;
};

export function getSocketIOServer(): SocketIOServer | null {
  return globalForSocketIO.socketIO ?? null;
}

export function setSocketIOServer(io: SocketIOServer): void {
  globalForSocketIO.socketIO = io;
}

export function getHttpServer(): HttpServer | HttpsServer | null {
  return globalForSocketIO.httpServer ?? null;
}

export function setHttpServer(server: HttpServer | HttpsServer): void {
  globalForSocketIO.httpServer = server;
}

export function isSocketIOInitialized(): boolean {
  return globalForSocketIO.socketIO !== undefined;
}

/**
 * 取得 SSL 憑證設定
 */
function getSSLOptions(): { key: Buffer; cert: Buffer } | null {
  // 生產環境: 從環境變數取得憑證路徑
  if (process.env.NODE_ENV === 'production') {
    const keyPath = process.env.SOCKET_IO_SSL_KEY_PATH;
    const certPath = process.env.SOCKET_IO_SSL_CERT_PATH;

    if (keyPath && certPath && existsSync(keyPath) && existsSync(certPath)) {
      console.log('[Socket.IO] Using production SSL certificates');
      return {
        key: readFileSync(keyPath),
        cert: readFileSync(certPath)
      };
    }
    console.log('[Socket.IO] No production SSL certificates found');
    return null;
  }

  // 開發環境: 使用 Next.js 開發用憑證
  const devKeyPath = join(process.cwd(), 'certificates', 'localhost-key.pem');
  const devCertPath = join(process.cwd(), 'certificates', 'localhost.pem');

  if (existsSync(devKeyPath) && existsSync(devCertPath)) {
    console.log('[Socket.IO] Using development SSL certificates');
    return {
      key: readFileSync(devKeyPath),
      cert: readFileSync(devCertPath)
    };
  }

  console.log('[Socket.IO] No development SSL certificates found');
  return null;
}

/**
 * 初始化 Socket.IO 伺服器（獨立模式）
 *
 * 此函式會在獨立的 port 上啟動 Socket.IO 伺服器
 * 因為 Next.js 不支援直接在 API routes 中使用 WebSocket
 */
export function initializeSocketIOServer(port: number = 3002): SocketIOServer {
  if (globalForSocketIO.socketIO) {
    console.log('[Socket.IO] Server already initialized');
    return globalForSocketIO.socketIO;
  }

  // 嘗試取得 SSL 憑證
  const sslOptions = getSSLOptions();
  const isHttps = sslOptions !== null;

  // 創建 HTTP 或 HTTPS 伺服器
  const httpServer: HttpServer | HttpsServer = isHttps
    ? createHttpsServer(sslOptions)
    : createHttpServer();

  const protocol = isHttps ? 'wss' : 'ws';
  const httpProtocol = isHttps ? 'https' : 'http';

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://localhost:3000',
        'https://localhost:3001'
      ],
      methods: ['GET', 'POST'],
      credentials: true
    },
    path: '/socket.io'
  });

  // 全域命名空間
  io.on('connection', (socket) => {
    console.log('[Socket.IO] Client connected:', socket.id);

    socket.on('ping', (callback) => {
      if (typeof callback === 'function') {
        callback();
      }
    });

    socket.on('message', (data) => {
      console.log('[Socket.IO] Message received:', data);
      io.emit('message', data);
    });

    socket.on('disconnect', () => {
      console.log('[Socket.IO] Client disconnected:', socket.id);
    });
  });

  // Socket.IO 測試命名空間
  // 使用與 Native WebSocket 相同的 type/event 設計
  const socketIoNamespace = io.of('/socket.io');

  socketIoNamespace.on('connection', (socket) => {
    console.log('[Socket.IO /socket.io] Client connected:', socket.id);

    // 處理訊息
    socket.on('message', (payload: {
      type?: 'broadcast' | 'room' | 'private';
      event?: string;
      room?: string;
      data?: unknown;
    }) => {
      console.log('[Socket.IO /socket.io] Message:', payload);

      // 先檢查特殊的系統事件
      if (payload.event === 'joinRoom' && payload.room) {
        socket.join(payload.room);
        console.log(`[Socket.IO] Socket ${socket.id} joined room ${payload.room}`);
        socket.emit('message', {
          type: 'private',
          event: 'joinedRoom',
          room: payload.room,
          data: { success: true }
        });
        return;
      }

      if (payload.event === 'leaveRoom' && payload.room) {
        socket.leave(payload.room);
        console.log(`[Socket.IO] Socket ${socket.id} left room ${payload.room}`);
        socket.emit('message', {
          type: 'private',
          event: 'leftRoom',
          room: payload.room,
          data: { success: true }
        });
        return;
      }

      // 根據 type 決定傳送方式
      switch (payload.type) {
        case 'broadcast':
          // 廣播給所有連線（包含發送者）
          socketIoNamespace.emit('message', payload);
          break;

        case 'room':
          // 推送給特定房間
          if (payload.room) {
            socketIoNamespace.to(payload.room).emit('message', payload);
          } else {
            socket.emit('message', {
              type: 'private',
              event: 'error',
              data: { message: 'Room name required' }
            });
          }
          break;

        case 'private':
        default:
          // 私人訊息，只回傳給發送者
          socket.emit('message', payload);
          break;
      }
    });

    // 相容舊的 socket.io-test 事件
    socket.on('socket.io-test', (payload) => {
      console.log('[Socket.IO /socket.io] Test message:', payload);
      socketIoNamespace.emit('socket.io-test', payload);
    });

    socket.on('ping', (callback) => {
      if (typeof callback === 'function') {
        callback();
      }
    });

    socket.on('disconnect', () => {
      console.log('[Socket.IO /socket.io] Client disconnected:', socket.id);
    });
  });

  // Socket.IO 房間命名空間
  io.of('/socket.io/room').on('connection', (socket) => {
    console.log('[Socket.IO /socket.io/room] Client connected:', socket.id);
    let currentRoom = '';

    socket.on('joinRoom', (roomId: string) => {
      if (currentRoom) {
        socket.leave(currentRoom);
      }
      currentRoom = roomId;
      socket.join(roomId);
      console.log(`[Socket.IO] Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('message', (payload) => {
      console.log('[Socket.IO /socket.io/room] Message:', payload);
      if (currentRoom) {
        io.of('/socket.io/room').to(currentRoom).emit('message', payload);
      } else {
        socket.emit('message', payload);
      }
    });

    socket.on('leaveRoom', () => {
      if (currentRoom) {
        socket.leave(currentRoom);
        currentRoom = '';
      }
    });
  });

  // WebRTC 信令命名空間
  const webRtcNamespace = io.of('/socket.io/web-rtc');

  webRtcNamespace.on('connection', (socket) => {
    console.log('[Socket.IO /socket.io/web-rtc] Client connected:', socket.id);
    let webRtcRoom = '';

    socket.on('webrtcJoin', async (roomId: string) => {
      console.log('[Socket.IO /socket.io/web-rtc] Join room:', roomId);
      if (webRtcRoom) {
        socket.leave(webRtcRoom);
      }
      webRtcRoom = roomId;
      socket.join(roomId);

      // 檢查房間中有多少人，決定誰是 offer 方
      const socketsInRoom = await webRtcNamespace.in(roomId).fetchSockets();
      const isOffer = socketsInRoom.length === 1; // 第一個人是 offer 方

      console.log(
        `[Socket.IO /socket.io/web-rtc] Room ${roomId} has ${socketsInRoom.length} clients, isOffer: ${isOffer}`
      );

      // 通知客戶端
      socket.emit('webrtcJoined', { isOffer });

      // 通知房間內其他人有新用戶加入
      socket.to(roomId).emit('webrtcNewUser', { socketId: socket.id });
    });

    socket.on('webrtcDescription', (payload) => {
      console.log('[Socket.IO /socket.io/web-rtc] Description:', payload.type);
      if (webRtcRoom) {
        socket.to(webRtcRoom).emit('webrtcDescription', payload);
      }
    });

    socket.on('webrtcCandidate', (payload) => {
      console.log('[Socket.IO /socket.io/web-rtc] ICE Candidate');
      if (webRtcRoom) {
        socket.to(webRtcRoom).emit('webrtcCandidate', payload);
      }
    });

    socket.on('ping', (callback) => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(
      `[Socket.IO] Server started on ${httpProtocol}://localhost:${port} (${protocol})`
    );
  });

  globalForSocketIO.socketIO = io;
  globalForSocketIO.httpServer = httpServer;

  return io;
}

/**
 * 關閉 Socket.IO 伺服器
 */
export function closeSocketIOServer(): Promise<void> {
  return new Promise((resolve) => {
    if (globalForSocketIO.socketIO) {
      globalForSocketIO.socketIO.close(() => {
        console.log('[Socket.IO] Server closed');
        globalForSocketIO.socketIO = undefined;
      });
    }
    if (globalForSocketIO.httpServer) {
      globalForSocketIO.httpServer.close(() => {
        console.log('[Socket.IO] HTTP Server closed');
        globalForSocketIO.httpServer = undefined;
        resolve();
      });
    } else {
      resolve();
    }
  });
}
