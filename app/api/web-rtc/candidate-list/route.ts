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

interface CandidateRequest {
  roomId: string;
  userId: string;
  candidateList: RTCIceCandidateInit[];
}

interface MemberCandidate {
  roomId: string;
  userId: string;
  candidateList: RTCIceCandidateInit[];
}

export async function POST(request: Request) {
  try {
    const body: CandidateRequest = await request.json();
    const { roomId, userId, candidateList } = body;

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

    if (!Array.isArray(candidateList) || candidateList.length <= 0) {
      return NextResponse.json(
        { error: 'invalid webRTC candidate list' },
        { status: 400 }
      );
    }

    // Get existing candidate list for this room
    const memberCandidateListString = await redis.get<string>(
      `web-rtc-member-candidate-list-${roomId}`
    );
    const memberCandidateList: MemberCandidate[] = memberCandidateListString
      ? (safeParseJSON<MemberCandidate[]>(memberCandidateListString) ?? [])
      : [];

    // Check if user already has candidates
    const existingIndex = memberCandidateList.findIndex(
      (member) => member.userId === userId
    );

    if (existingIndex >= 0) {
      // Update existing candidate list
      memberCandidateList[existingIndex].candidateList = candidateList;
    } else {
      // Add new candidate entry
      memberCandidateList.push({
        roomId,
        userId,
        candidateList
      });
    }

    await redis.set(
      `web-rtc-member-candidate-list-${roomId}`,
      safeToJSON(memberCandidateList),
      { ex: 60 * 10 }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WebRTC candidate-list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
