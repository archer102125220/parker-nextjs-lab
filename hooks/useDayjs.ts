import { useRef } from 'react';
import type { Dayjs, ConfigType } from 'dayjs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import isBetween from 'dayjs/plugin/isBetween.js';
import isToday from 'dayjs/plugin/isToday.js';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-tw';

dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(timezone);
dayjs.extend(utc);

export function useDayjs(props: ConfigType): Dayjs {
  const dayjsRef = useRef<Dayjs>(dayjs(props));

  return dayjsRef.current;
}

export default useDayjs;
