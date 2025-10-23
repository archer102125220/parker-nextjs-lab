import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

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

export function usePostEventSource(
  config: PostEventSourceConfig = { channel: '/' }
): RefObject<PostEventSourceObjType> {
  const PostEventSourceObj = useRef<PostEventSourceObjType>({
    croe: null,
    lastMessgTime: null,
    timeoutTimestamp: null
  });

  function handleCheckConnect() {
    if (PostEventSourceObj.current.timeoutTimestamp !== null) {
      clearTimeout(PostEventSourceObj.current.timeoutTimestamp);
    }

    const nowDayjs = dayjs();
    const lastMessgTimeDayjs =
      PostEventSourceObj.current.lastMessgTime || dayjs();
    const diff = nowDayjs.diff(lastMessgTimeDayjs, 'second');

    if (diff > 10) {
      PostEventSourceObj.current.lastMessgTime = null;
      return initPostEventSource(config);
    }

    PostEventSourceObj.current.lastMessgTime = dayjs().valueOf();
    PostEventSourceObj.current.timeoutTimestamp = setTimeout(
      handleCheckConnect,
      1000 * 10
    );
  }
  function initPostEventSource(currentConfig: PostEventSourceConfig = {}) {
    console.log('initPostEventSource');
    if (typeof window === 'undefined' || typeof PostEventSource !== 'function')
      return;

    if (typeof PostEventSourceObj.current.croe?.close === 'function') {
      PostEventSourceObj.current.croe.close();
    }

    const { channel: currentChannel, postData } = currentConfig;

    const path =
      currentChannel?.indexOf('/') === 0
        ? SERVER_SENT_EVENT_BASE_PATH + currentChannel
        : SERVER_SENT_EVENT_BASE_PATH + '/' + currentChannel;

    const newPostEventSource = new PostEventSource(DOMAIN + path, {
      postData
    });

    // if (typeof currentConfig?.open === 'function') {
    //   newPostEventSource.addEventListener('open', currentConfig.open);
    // }
    newPostEventSource.addEventListener('open', async function (...arg) {
      handleCheckConnect();

      if (typeof config?.open === 'function') {
        await config.open(...arg);
      }
    });
    if (typeof currentConfig?.error === 'function') {
      newPostEventSource.addEventListener('error', currentConfig.error);
    }
    // if (typeof currentConfig?.message === 'function') {
    //   newPostEventSource.addEventListener('message', currentConfig.message);
    // }
    newPostEventSource.addEventListener(
      'message',
      async function (event: Event) {
        handleCheckConnect();

        if (typeof config?.message === 'function') {
          await config.message(event as MessageEvent);
        }
      }
    );
    if (typeof currentConfig?.ping === 'function') {
      newPostEventSource.addEventListener('ping', currentConfig.ping);
    }

    if (Array.isArray(currentConfig?.eventList) === true) {
      currentConfig.eventList.forEach((event) => {
        if (
          typeof event.name === 'string' &&
          typeof event.handler === 'function'
        ) {
          newPostEventSource.addEventListener(event.name, event.handler);
        }
      });
    }

    PostEventSourceObj.current.croe = newPostEventSource;
  }

  useEffect(() => {
    initPostEventSource(config);

    // 在 effect 開始時複製 ref 的值
    const timeoutTimestamp = PostEventSourceObj.current.timeoutTimestamp;
    const croe = PostEventSourceObj.current.croe;

    return () => {
      if (timeoutTimestamp !== null) {
        clearTimeout(timeoutTimestamp);
      }
      if (typeof croe?.close === 'function') {
        croe.close();
      }
    };
    // TODO
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return PostEventSourceObj;
}

export default usePostEventSource;
