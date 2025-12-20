import { Redis } from '@upstash/redis';

// Initialize Upstash Redis from environment variables
// Uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
const redis = Redis.fromEnv();

function safeToJSON(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return '{}';
  }
}

function safeParseJSON<T>(str: string | null | undefined): T | null {
  if (!str) return null;
  try {
    return typeof str === 'string' ? JSON.parse(str) : str;
  } catch {
    return null;
  }
}

interface RoomMessage {
  userId: string;
  message: string;
  timestamp: string;
}

/**
 * SSE Room API
 *
 * 提供房間基礎的 SSE 訊息串流
 * 使用 Upstash Redis 儲存房間訊息
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId') || 'anonymous';

  console.log('SSE Room GET:', { roomId, userId });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (eventName: string, data: unknown) => {
        const message = `event: ${eventName}\ndata: ${safeToJSON(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial connection message
      sendEvent('connected', {
        roomId,
        userId,
        time: new Date().toISOString()
      });

      // Poll for new messages
      let lastMessageCount = 0;
      const interval = setInterval(async () => {
        try {
          const messagesString = await redis.get<string>(
            `sse-room-messages-${roomId}`
          );
          const messages: RoomMessage[] = messagesString
            ? (safeParseJSON<RoomMessage[]>(messagesString) ?? [])
            : [];

          // Send new messages if any
          if (messages.length > lastMessageCount) {
            const newMessages = messages.slice(lastMessageCount);
            for (const msg of newMessages) {
              sendEvent('message', msg);
            }
            lastMessageCount = messages.length;
          }

          // Send heartbeat every interval
          sendEvent('heartbeat', { time: new Date().toISOString() });
        } catch (error) {
          console.error('SSE Room polling error:', error);
        }
      }, 1000);

      request.signal.addEventListener('abort', () => {
        console.log('SSE Room: client disconnected', { roomId, userId });
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
