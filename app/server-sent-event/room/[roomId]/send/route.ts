import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

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

interface SendMessageRequest {
  userId: string;
  message: string;
}

interface RoomMessage {
  userId: string;
  message: string;
  timestamp: string;
}

/**
 * SSE Room Send Message API
 *
 * POST 訊息到指定房間，訊息會被儲存到 Redis
 * 連線到該房間 SSE 的客戶端會收到訊息
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const body: SendMessageRequest = await request.json();
    const { userId, message } = body;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      );
    }

    // Get existing messages
    const messagesString = await redis.get<string>(
      `nextjs-lab:sse-room-messages-${roomId}`
    );
    const messages: RoomMessage[] = messagesString
      ? (safeParseJSON<RoomMessage[]>(messagesString) ?? [])
      : [];

    // Add new message
    const newMessage: RoomMessage = {
      userId,
      message,
      timestamp: new Date().toISOString()
    };
    messages.push(newMessage);

    // Keep only last 100 messages
    const trimmedMessages = messages.slice(-100);

    // Save to Redis with 1 hour TTL
    await redis.set(
      `nextjs-lab:sse-room-messages-${roomId}`,
      safeToJSON(trimmedMessages),
      { ex: 60 * 60 }
    );

    return NextResponse.json({
      success: true,
      message: newMessage,
      totalMessages: trimmedMessages.length
    });
  } catch (error) {
    console.error('SSE Room send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
