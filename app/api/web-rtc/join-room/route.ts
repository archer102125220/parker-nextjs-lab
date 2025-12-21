import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Upstash Redis from environment variables
// Uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
const redis = Redis.fromEnv();

// Helper functions for safe JSON handling
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

interface JoinRoomRequest {
  roomId: string;
  userId: string;
}

interface MemberType {
  roomId: string;
  userId: string;
  isOffer: boolean;
  isAnswer: boolean;
}

export async function POST(request: Request) {
  try {
    const body: JoinRoomRequest = await request.json();
    const { roomId, userId } = body;

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

    // Get existing member list
    const memberListString = await redis.get<string>(
      `nextjs-lab:web-rtc-member-list-${roomId}`
    );
    const memberList: MemberType[] = memberListString
      ? (safeParseJSON<MemberType[]>(memberListString) ?? [])
      : [];
    const oldMemberListLength = memberList.length;

    const memberType: MemberType = {
      roomId,
      userId,
      isOffer: oldMemberListLength <= 0,
      isAnswer: oldMemberListLength > 0
    };

    // Add user to member list if not already present
    const userExists = memberList.some((member) => member.userId === userId);
    if (!userExists) {
      memberList.push(memberType);

      await redis.set(
        `nextjs-lab:web-rtc-member-list-${roomId}`,
        safeToJSON(memberList),
        { ex: 60 * 10 } // 10 minutes TTL
      );
    }

    // Store individual member type
    await redis.set(
      `nextjs-lab:web-rtc-member-type-${roomId}-${userId}`,
      safeToJSON(memberType),
      { ex: 60 * 10 }
    );

    return NextResponse.json(memberType);
  } catch (error) {
    console.error('WebRTC join-room error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
