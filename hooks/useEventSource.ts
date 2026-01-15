import {
  type RefObject,
  useEffect,
  useRef,
  useState,
  useCallback,
  useEffectEvent
} from 'react';

import { dayjs } from '@/hooks/useDayjs';

const DOMAIN =
  (process.env.NODE_ENV === 'development'
    ? typeof window !== 'undefined'
      ? window?.location?.origin
      : ''
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

  const [connectCount, setConnectCount] = useState(0);

  // Use useEffectEvent to stabilize event handlers
  const onOpen = useEffectEvent(async (event: Event) => {
    handleCheckConnect();
    if (typeof config?.open === 'function') {
      await config.open(event);
    }
  });

  const onMessage = useEffectEvent(async (event: MessageEvent) => {
    handleCheckConnect();
    if (typeof config?.message === 'function') {
      await config.message(event);
    }
  });

  const onError = useEffectEvent((event: Event) => {
    if (typeof config?.error === 'function') {
      config.error(event);
    }
  });

  const onPing = useEffectEvent((event: Event) => {
    if (typeof config?.ping === 'function') {
      config.ping(event);
    }
  });

  const handleCustomEvent = useEffectEvent(
    (eventName: string, event: Event) => {
      const targetEvent = config.eventList?.find((e) => e.name === eventName);
      if (targetEvent && typeof targetEvent.handler === 'function') {
        targetEvent.handler(event);
      }
    }
  );

  const reconnect = useCallback(() => {
    EventSourceObj.current.lastMessgTime = null;
    setConnectCount((c) => c + 1);
  }, []);

  // We need to access reconnect inside handleCheckConnect
  // But handleCheckConnect is called by useEffectEvents
  // Using a ref to hold reconnect allows us to call it without deps issues
  const reconnectRef = useRef(reconnect);
  useEffect(() => {
    reconnectRef.current = reconnect;
  }, [reconnect]);

  function handleCheckConnect() {
    if (EventSourceObj.current.timeoutTimestamp !== null) {
      clearTimeout(EventSourceObj.current.timeoutTimestamp);
    }

    const nowDayjs = dayjs();
    const lastMessgTimeDayjs =
      EventSourceObj.current.lastMessgTime || dayjs().valueOf();
    const diff = nowDayjs.diff(lastMessgTimeDayjs, 'second');

    // Reconnect if no message received for 10 seconds
    if (diff > 10) {
      return reconnectRef.current();
    }

    EventSourceObj.current.lastMessgTime = dayjs().valueOf();
    EventSourceObj.current.timeoutTimestamp = setTimeout(
      handleCheckConnect,
      1000 * 10
    );
  }

  useEffect(() => {
    let newEventSourceObj: EventSource | null = null;
    const esObj = EventSourceObj.current;

    const initEventSource = (channel: string) => {
      if (
        typeof window === 'undefined' ||
        typeof window?.EventSource !== 'function'
      )
        return;

      // Cleanup previous if exists inside the effect scope logic
      // But here we depend on cleanup function to do it

      const path =
        channel.indexOf('/') === 0
          ? SERVER_SENT_EVENT_BASE_PATH + channel
          : SERVER_SENT_EVENT_BASE_PATH + '/' + channel;

      newEventSourceObj = new EventSource(DOMAIN + path);

      // Attach stable event handlers
      newEventSourceObj.addEventListener('open', (e) => onOpen(e));
      newEventSourceObj.addEventListener('message', (e) => onMessage(e));
      newEventSourceObj.addEventListener('error', (e) => onError(e));
      newEventSourceObj.addEventListener('ping', (e) => onPing(e));

      if (Array.isArray(config.eventList)) {
        config.eventList.forEach((event) => {
          if (typeof event.name === 'string') {
            newEventSourceObj!.addEventListener(event.name, (e) =>
              handleCustomEvent(event.name, e)
            );
          }
        });
      }

      esObj.croe = newEventSourceObj;
      esObj.lastMessgTime = dayjs().valueOf();
    };

    // Only initialize when channel changes
    initEventSource(config.channel || '/');

    // Cleanup
    return () => {
      if (esObj.timeoutTimestamp !== null) {
        clearTimeout(esObj.timeoutTimestamp);
      }
      if (newEventSourceObj) {
        newEventSourceObj.close();
      }
      esObj.croe = null;
    };
    // Reconnect on channel change or connectCount trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.channel, connectCount]);

  return EventSourceObj;
}

export default useEventSource;
