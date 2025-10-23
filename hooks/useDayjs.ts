import type { RefObject } from 'react';
import { useRef } from 'react';
import type { Dayjs, ConfigType } from 'dayjs';
import _dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import isBetween from 'dayjs/plugin/isBetween.js';
import isToday from 'dayjs/plugin/isToday.js';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-tw';

export const dayjs = _dayjs;
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(timezone);
dayjs.extend(utc);

export function useDayjs(props: ConfigType): RefObject<Dayjs> {
  const dayjsRef = useRef<Dayjs>(dayjs(props));

  return dayjsRef;
}

export default useDayjs;
