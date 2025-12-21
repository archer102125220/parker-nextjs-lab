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

interface MemberType {
  roomId: string;
  userId: string;
  isOffer: boolean;
  isAnswer: boolean;
}

interface MemberCandidate {
  roomId: string;
  userId: string;
  candidateList: RTCIceCandidateInit[];
}

interface MemberDescription {
  roomId: string;
  userId: string;
  description: RTCSessionDescriptionInit;
}

interface WebRTCSettings {
  roomId: string;
  userId: string;
  memberCandidateList: MemberCandidate[];
  memberDescriptionList: MemberDescription[];
  isOffer: boolean | undefined;
  isAnswer: boolean | undefined;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;

  // Read userId from request body
  const body = await request.json().catch(() => ({}));
  const userId = body?.userId || '';

  // Create SSE response
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (eventName: string, data: unknown) => {
        const message = `event: ${eventName}\ndata: ${safeToJSON(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Polling interval (1 second)
      const interval = setInterval(async () => {
        try {
          const [
            memberTypeString,
            memberCandidateListString,
            memberDescriptionListString
          ] = await Promise.all([
            redis.get<string>(`nextjs-lab:web-rtc-member-type-${roomId}-${userId}`),
            redis.get<string>(`nextjs-lab:web-rtc-member-candidate-list-${roomId}`),
            redis.get<string>(`nextjs-lab:web-rtc-member-description-list-${roomId}`)
          ]);

          const memberType = memberTypeString
            ? safeParseJSON<MemberType>(memberTypeString)
            : null;
          const memberCandidateList = memberCandidateListString
            ? (safeParseJSON<MemberCandidate[]>(memberCandidateListString) ??
              [])
            : [];
          const memberDescriptionList = memberDescriptionListString
            ? (safeParseJSON<MemberDescription[]>(
                memberDescriptionListString
              ) ?? [])
            : [];

          const webRTCSetting: WebRTCSettings = {
            roomId,
            userId,
            memberCandidateList,
            memberDescriptionList,
            isOffer: memberType?.isOffer,
            isAnswer: memberType?.isAnswer
          };

          sendEvent('webrtc', webRTCSetting);
        } catch (error) {
          console.error('WebRTC SSE polling error:', error);
        }
      }, 1000);

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
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

// Also support GET for standard EventSource
export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || '';

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (eventName: string, data: unknown) => {
        const message = `event: ${eventName}\ndata: ${safeToJSON(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      const interval = setInterval(async () => {
        try {
          const [
            memberTypeString,
            memberCandidateListString,
            memberDescriptionListString
          ] = await Promise.all([
            redis.get<string>(`nextjs-lab:web-rtc-member-type-${roomId}-${userId}`),
            redis.get<string>(`nextjs-lab:web-rtc-member-candidate-list-${roomId}`),
            redis.get<string>(`nextjs-lab:web-rtc-member-description-list-${roomId}`)
          ]);

          const memberType = memberTypeString
            ? safeParseJSON<MemberType>(memberTypeString)
            : null;
          const memberCandidateList = memberCandidateListString
            ? (safeParseJSON<MemberCandidate[]>(memberCandidateListString) ??
              [])
            : [];
          const memberDescriptionList = memberDescriptionListString
            ? (safeParseJSON<MemberDescription[]>(
                memberDescriptionListString
              ) ?? [])
            : [];

          const webRTCSetting: WebRTCSettings = {
            roomId,
            userId,
            memberCandidateList,
            memberDescriptionList,
            isOffer: memberType?.isOffer,
            isAnswer: memberType?.isAnswer
          };

          sendEvent('webrtc', webRTCSetting);
        } catch (error) {
          console.error('WebRTC SSE polling error:', error);
        }
      }, 1000);

      request.signal.addEventListener('abort', () => {
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
