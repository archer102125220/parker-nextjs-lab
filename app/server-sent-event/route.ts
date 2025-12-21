/**
 * Server-Sent Events Global API
 *
 * 提供全域 SSE 訊息串流
 * 每秒推送當前時間訊息給連線的客戶端
 */

function safeToJSON(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return '{}';
  }
}

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams);

  console.log('SSE Global GET:', { query });

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: unknown) => {
        const message = `data: ${safeToJSON(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial message
      sendEvent({ connected: true, time: new Date().toISOString() });

      // Send periodic messages
      const interval = setInterval(() => {
        sendEvent({ time: `Message @ ${new Date().toLocaleTimeString()}` });
      }, 1000);

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        console.log('SSE Global: client disconnected');
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

export async function POST(request: Request) {
  const encoder = new TextEncoder();

  // Read POST body
  const body = await request.json().catch(() => ({}));
  console.log('SSE Global POST:', { body });

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: unknown) => {
        const message = `data: ${safeToJSON(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial message with POST data
      sendEvent({
        connected: true,
        time: new Date().toISOString(),
        receivedData: body
      });

      // Send periodic messages
      const interval = setInterval(() => {
        sendEvent({
          time: `POST Message @ ${new Date().toLocaleTimeString()}`,
          postData: body
        });
      }, 1000);

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        console.log('SSE Global POST: client disconnected');
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
