import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import { dayjs } from '@/hooks/useDayjs';

const DOMAIN =
  (process.env.NODE_ENV === 'development'
    ? window?.location?.origin
    : process.env.NEXT_PUBLIC_DOMAIN || window?.location?.origin) || '';
const SERVER_SENT_EVENT_BASE_PATH =
  process.env.NEXT_PUBLIC_SERVER_SENT_EVENT_BASE_PATH || '/server-sent-event';

interface EventSourceConfig {
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

interface EventSourceObjType {
  croe: EventSource | null;
  lastMessgTime: number | null;
  timeoutTimestamp: NodeJS.Timeout | null;
}

export function useEventSource(
  config: EventSourceConfig = { channel: '/' }
): RefObject<EventSourceObjType> {
  const EventSourceObj = useRef<EventSourceObjType>({
    croe: null,
    lastMessgTime: null,
    timeoutTimestamp: null
  });

  function handleCheckConnect() {
    if (EventSourceObj.current.timeoutTimestamp !== null) {
      clearTimeout(EventSourceObj.current.timeoutTimestamp);
    }

    const nowDayjs = dayjs();
    const lastMessgTimeDayjs =
      EventSourceObj.current.lastMessgTime || dayjs().valueOf();
    const diff = nowDayjs.diff(lastMessgTimeDayjs, 'second');

    if (diff > 10) {
      EventSourceObj.current.lastMessgTime = null;
      return initEventSource(config);
    }

    EventSourceObj.current.lastMessgTime = dayjs().valueOf();
    EventSourceObj.current.timeoutTimestamp = setTimeout(
      handleCheckConnect,
      1000 * 10
    );
  }
  function initEventSource(currentConfig: EventSourceConfig = {}) {
    if (
      typeof window === 'undefined' ||
      typeof window?.EventSource !== 'function'
    )
      return;

    if (typeof EventSourceObj.current.croe?.close === 'function') {
      EventSourceObj.current.croe.close();
    }

    const { channel: currentChannel = '/' } = currentConfig;

    const path =
      currentChannel.indexOf('/') === 0
        ? SERVER_SENT_EVENT_BASE_PATH + currentChannel
        : SERVER_SENT_EVENT_BASE_PATH + '/' + currentChannel;

    const newEventSourceObj = new EventSource(DOMAIN + path);

    // if (typeof currentConfig?.open === 'function') {
    //   newEventSourceObj.addEventListener('open', currentConfig.open);
    // }
    newEventSourceObj.addEventListener('open', async function (...arg) {
      handleCheckConnect();

      if (typeof config?.open === 'function') {
        await config.open(...arg);
      }
    });
    if (typeof currentConfig?.error === 'function') {
      newEventSourceObj.addEventListener('error', currentConfig.error);
    }
    // if (typeof currentConfig?.message === 'function') {
    //   newEventSourceObj.addEventListener('message', currentConfig.message);
    // }
    newEventSourceObj.addEventListener('message', async function (...arg) {
      handleCheckConnect();

      if (typeof config?.message === 'function') {
        await config.message(...arg);
      }
    });
    if (typeof currentConfig?.ping === 'function') {
      newEventSourceObj.addEventListener('ping', currentConfig.ping);
    }

    if (Array.isArray(currentConfig?.eventList) === true) {
      currentConfig.eventList.forEach((event) => {
        if (
          typeof event.name === 'string' &&
          typeof event.handler === 'function'
        ) {
          newEventSourceObj.addEventListener(event.name, event.handler);
        }
      });
    }

    EventSourceObj.current.croe = newEventSourceObj;
  }

  useEffect(() => {
    initEventSource(config);

    // 在 effect 開始時複製 ref 的值
    const timeoutTimestamp = EventSourceObj.current.timeoutTimestamp;
    const croe = EventSourceObj.current.croe;

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

  return EventSourceObj;
}

export default useEventSource;
