/**
 * Next.js Instrumentation Hook
 *
 * 此檔案在 Next.js 伺服器啟動時執行
 * 用於初始化 Socket.IO 伺服器（僅限本地開發環境）
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // 只在 Node.js 環境中執行（非 Edge Runtime）
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 動態引入以避免在 Edge Runtime 中載入
    const {
      initializeSocketIOServer,
      isSocketIOInitialized,
      closeSocketIOServer
    } = await import('@/services/server/socket-io');

    // 只在尚未初始化時啟動
    if (!isSocketIOInitialized()) {
      const port = parseInt(process.env.SOCKET_IO_PORT || '3002', 10);
      console.log('[Instrumentation] Initializing Socket.IO server...');
      initializeSocketIOServer(port);
      console.log(`[Instrumentation] Socket.IO server running on port ${port}`);

      // 註冊關閉處理器
      const gracefulShutdown = async (signal: string) => {
        console.log(
          `[Instrumentation] Received ${signal}, shutting down Socket.IO...`
        );
        await closeSocketIOServer();
        console.log('[Instrumentation] Socket.IO server closed');
        process.exit(0);
      };

      // 監聽終止信號
      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }
  }
}
