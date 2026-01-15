import { NextResponse } from 'next/server';
import { getSocketIOServer } from '@/services/server/socket-io';

/**
 * Socket.IO Status API
 *
 * 回傳 Socket.IO 伺服器狀態資訊
 */
export async function GET() {
  const io = getSocketIOServer();

  if (!io) {
    return NextResponse.json({
      status: 'offline',
      message: 'Websocket server is not running',
      port: null,
      namespaces: []
    });
  }

  // 取得命名空間資訊
  const namespaces = [];
  for (const [name, nsp] of io._nsps) {
    namespaces.push({
      name,
      connected: nsp.sockets.size
    });
  }

  return NextResponse.json({
    status: 'online',
    message: 'Websocket server is running',
    port: process.env.WEBSOCKET_PORT || 3003,
    namespaces
  });
}
