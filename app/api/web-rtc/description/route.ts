import { NextResponse } from 'next/server';
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

interface DescriptionRequest {
  roomId: string;
  userId: string;
  description: RTCSessionDescriptionInit;
}

interface MemberDescription {
  roomId: string;
  userId: string;
  description: RTCSessionDescriptionInit;
}

export async function POST(request: Request) {
  try {
    const body: DescriptionRequest = await request.json();
    const { roomId, userId, description } = body;

    if (!roomId || typeof roomId !== 'string') {
      return NextResponse.json(
        { error: 'invalid webRTC room id' },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'invalid webRTC user id' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'object') {
      return NextResponse.json(
        { error: 'invalid webRTC description' },
        { status: 400 }
      );
    }

    // Get existing description list for this room
    const memberDescriptionListString = await redis.get<string>(
      `nextjs-lab:web-rtc-member-description-list-${roomId}`
    );
    const memberDescriptionList: MemberDescription[] =
      memberDescriptionListString
        ? (safeParseJSON<MemberDescription[]>(memberDescriptionListString) ??
          [])
        : [];

    // Check if user already has a description
    const existingIndex = memberDescriptionList.findIndex(
      (member) => member.userId === userId
    );

    if (existingIndex >= 0) {
      // Update existing description
      memberDescriptionList[existingIndex].description = description;
    } else {
      // Add new description entry
      memberDescriptionList.push({
        roomId,
        userId,
        description
      });
    }

    await redis.set(
      `nextjs-lab:web-rtc-member-description-list-${roomId}`,
      safeToJSON(memberDescriptionList),
      { ex: 60 * 10 }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WebRTC description error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
