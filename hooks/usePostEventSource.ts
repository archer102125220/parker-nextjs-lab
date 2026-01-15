import { useEffect, useRef, useEffectEvent, type RefObject } from 'react';

import { dayjs } from '@/hooks/useDayjs';
import {
  PostEventSource,
  type PostEventSourceOptions
} from '@/utils/request/post-event-source';

const DOMAIN =
  (process.env.NODE_ENV === 'development'
    ? window?.location?.origin
    : process.env.NEXT_PUBLIC_DOMAIN || window?.location?.origin) || '';
const SERVER_SENT_EVENT_BASE_PATH =
  process.env.NEXT_PUBLIC_SERVER_SENT_EVENT_BASE_PATH || '/server-sent-event';

interface PostEventSourceConfig extends PostEventSourceOptions {
  channel?: string;
  open?: (event: Event) => void | Promise<void>;
  error?: (event: Event) => void;
  message?: (event: MessageEvent) => void | Promise<void>;
  ping?: (event: Event) => void;
  eventList?: Array<{
    name: string;
    handler: (event: Event) => void;
  }>;
}

interface PostEventSourceObjType {
  croe: PostEventSource | null;
  lastMessgTime: number | null;
  timeoutTimestamp: NodeJS.Timeout | null;
}

/**
 * usePostEventSource - Hook for managing POST-based Server-Sent Events
 * 
 * @param config - Configuration object with channel, callbacks, and event handlers
 * @returns Ref object containing the PostEventSource instance and timing data
 */
export function usePostEventSource(
  config: PostEventSourceConfig = { channel: '/' }
): RefObject<PostEventSourceObjType> {
  const PostEventSourceObj = useRef<PostEventSourceObjType>({
    croe: null,
    lastMessgTime: null,
    timeoutTimestamp: null
  });

  // Use useEffectEvent for all callbacks to avoid them as dependencies
  const onOpen = useEffectEvent(async (event: Event) => {
    if (typeof config.open === 'function') {
      await config.open(event);
    }
  });

  const onError = useEffectEvent((event: Event) => {
    if (typeof config.error === 'function') {
      config.error(event);
    }
  });

  const onMessage = useEffectEvent(async (event: MessageEvent) => {
    if (typeof config.message === 'function') {
      await config.message(event);
    }
  });

  const onPing = useEffectEvent((event: Event) => {
    if (typeof config.ping === 'function') {
      config.ping(event);
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof PostEventSource !== 'function') {
      return;
    }

    const { channel, postData, eventList } = config;

    // Build path
    const path =
      channel?.indexOf('/') === 0
        ? SERVER_SENT_EVENT_BASE_PATH + channel
        : SERVER_SENT_EVENT_BASE_PATH + '/' + channel;

    // Close existing connection
    if (typeof PostEventSourceObj.current.croe?.close === 'function') {
      PostEventSourceObj.current.croe.close();
    }

    // Clear existing timeout
    if (PostEventSourceObj.current.timeoutTimestamp !== null) {
      clearTimeout(PostEventSourceObj.current.timeoutTimestamp);
    }

    console.log('initPostEventSource');

    const newPostEventSource = new PostEventSource(DOMAIN + path, { postData });

    // Health check function
    const checkConnect = () => {
      if (PostEventSourceObj.current.timeoutTimestamp !== null) {
        clearTimeout(PostEventSourceObj.current.timeoutTimestamp);
      }

      const nowDayjs = dayjs();
      const lastMessgTimeDayjs =
        PostEventSourceObj.current.lastMessgTime || dayjs();
      const diff = nowDayjs.diff(lastMessgTimeDayjs, 'second');

      if (diff > 10) {
        // Connection stale, will reinitialize on next effect run
        PostEventSourceObj.current.lastMessgTime = null;
        return;
      }

      PostEventSourceObj.current.lastMessgTime = dayjs().valueOf();
      PostEventSourceObj.current.timeoutTimestamp = setTimeout(
        checkConnect,
        1000 * 10
      );
    };

    // Setup event listeners - all callbacks use useEffectEvent ✅
    newPostEventSource.addEventListener('open', async (event) => {
      checkConnect();
      await onOpen(event);
    });

    newPostEventSource.addEventListener('error', (event) => {
      onError(event);
    });

    newPostEventSource.addEventListener('message', async (event) => {
      checkConnect();
      await onMessage(event as MessageEvent);
    });

    newPostEventSource.addEventListener('ping', (event) => {
      onPing(event);
    });

    // Custom event handlers
    if (Array.isArray(eventList)) {
      eventList.forEach((evt) => {
        if (typeof evt.name === 'string' && typeof evt.handler === 'function') {
          newPostEventSource.addEventListener(evt.name, evt.handler);
        }
      });
    }

    PostEventSourceObj.current.croe = newPostEventSource;

    // Cleanup
    return () => {
      if (PostEventSourceObj.current.timeoutTimestamp !== null) {
        clearTimeout(PostEventSourceObj.current.timeoutTimestamp);
        PostEventSourceObj.current.timeoutTimestamp = null;
      }
      if (typeof newPostEventSource.close === 'function') {
        newPostEventSource.close();
      }
      PostEventSourceObj.current.croe = null;
    };
  }, [config.channel, config.postData, config.eventList]);

  return PostEventSourceObj;
}

export default usePostEventSource;

