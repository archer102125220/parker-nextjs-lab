import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

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
  httpServer: HttpServer | undefined;
};

export function getSocketIOServer(): SocketIOServer | null {
  return globalForSocketIO.socketIO ?? null;
}

export function setSocketIOServer(io: SocketIOServer): void {
  globalForSocketIO.socketIO = io;
}

export function getHttpServer(): HttpServer | null {
  return globalForSocketIO.httpServer ?? null;
}

export function setHttpServer(server: HttpServer): void {
  globalForSocketIO.httpServer = server;
}

export function isSocketIOInitialized(): boolean {
  return globalForSocketIO.socketIO !== undefined;
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

  const httpServer = new HttpServer();
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://localhost:3000'
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
  io.of('/socket.io').on('connection', (socket) => {
    console.log('[Socket.IO /socket.io] Client connected:', socket.id);

    socket.on('socket.io-test', (payload) => {
      console.log('[Socket.IO /socket.io] Test message:', payload);
      socket.emit('socket.io-test', payload);
    });

    socket.on('message', (payload) => {
      console.log('[Socket.IO /socket.io] Message:', payload);
      socket.emit('message', payload);
    });

    socket.on('ping', (callback) => {
      if (typeof callback === 'function') {
        callback();
      }
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
  io.of('/socket.io/web-rtc').on('connection', (socket) => {
    console.log('[Socket.IO /socket.io/web-rtc] Client connected:', socket.id);
    let webRtcRoom = '';

    socket.on('webrtcJoin', (roomId: string) => {
      console.log('[Socket.IO /socket.io/web-rtc] Join room:', roomId);
      if (webRtcRoom) {
        socket.leave(webRtcRoom);
      }
      webRtcRoom = roomId;
      socket.join(roomId);
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
    console.log(`[Socket.IO] Server started on port ${port}`);
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
