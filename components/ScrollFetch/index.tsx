'use client';
import type {
  ReactNode,
  WheelEvent,
  UIEvent,
  FunctionComponent,
  TouchEvent,
  MouseEvent,
  CSSProperties
} from 'react';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';

import _debounce from 'lodash/debounce';

import { handleBindScrollEnd } from '@/utils/polyfill/scroll-end';
import { GoTop } from '@/components/GoTop';

import '@/components/ScrollFetch/scroll_fetch.scss';
import styles from '@/components/ScrollFetch/scroll_fetch.module.scss';

interface ScrollFetchProps {
  nonce?: string;
  className?: string;

  pullLabel?: string;
  height?: string | number;
  containerHeight?: string | number;
  pullingLabel?: string;
  loadingLabel?: string;
  refreshIcon?: string;
  refreshingIcon?: string;
  refreshDisable?: boolean;
  loading?: boolean;
  iosStyle?: boolean;
  iosTypeIconSize?: string | number;
  iosTypeIconStrokeWidth?: string | number;
  isEmpty?: boolean;
  emptyLabel?: string;
  useObserver?: boolean;
  infinityLabel?: string;
  infinityEndLabel?: string;
  infinityBuffer?: number;
  infinityDisable?: boolean;
  // isScrollToFetch?: boolean;
  infinityEnd?: boolean;
  vibrate?: boolean;
  infinityTimeout?: number;
  scrollTop?: number;
  userSelectNone?: boolean;
  hasGoTop?: boolean;
  isMobile?: boolean;

  children?: ReactNode;
  refreshRender?: (props: {
    isPulling: boolean;
    isPullStart: boolean;
    isShowRefreshIcon: boolean;
  }) => ReactNode;
  refreshingRender?: () => ReactNode;
  refreshIconRender?: (props: {
    isShowRefreshIcon: boolean;
    isPullStart: boolean;
  }) => ReactNode;
  emptyRender?: () => ReactNode;
  infinityLabelRender?: (props: {
    loading: boolean;
    infinityEnd: boolean;
  }) => ReactNode;

  onRefresh?: () => Promise<void> | void;
  onInfinityFetch?: () => Promise<void> | void;
  onWheel?: (e: WheelEvent) => void;
  onScroll?: (e: UIEvent<HTMLDivElement>) => void;
  onScrollTopChange?: (scrollTop: number) => void;
  onScrollEnd?: (e: UIEvent<HTMLDivElement>) => void;
  onInfinityFail?: (error: Error) => void;
}
interface ScrollFetchCssVariable extends CSSProperties {
  ['--refresh_icon_transform']?: string;
  ['--refresh_transition']?: string;
  ['--refresh_transform']?: string;
  ['--refresh_ios_type_icon_size']?: number | string;
  ['--refresh_ios_type_icon_stroke_width']?: number | string;

  ['--refresh_icon_transition']?: string;
  ['--refresh_icon_rotate']?: string;

  ['--refresh_height']?: number | string;
  ['--refresh_container_height']?: number | string;
  ['--refresh_user_select']?: string;
  ['--refresh_overflow']?: string;

  ['--refresh_trigger_z_index']?: number | string;
}

const MOVE_DISTANCE_LIMIT = 50;

const ScrollFetch: FunctionComponent<ScrollFetchProps> = (props) => {
  const {
    nonce,

    className,

    pullLabel = '下拉即可重整...',
    height,
    containerHeight,
    pullingLabel = '釋放即可重整...',
    loadingLabel = '加載中...',
    refreshIcon,
    refreshingIcon,
    refreshDisable = true,
    loading = false,
    iosStyle = false,
    iosTypeIconSize = 10,
    iosTypeIconStrokeWidth = 2,
    isEmpty = false,
    emptyLabel = '暂无资料',
    useObserver = true,
    infinityLabel = '拉至底部可繼續加載',
    infinityEndLabel = '沒有更多資料了',
    infinityBuffer = 100,
    infinityDisable = false,
    // isScrollToFetch = true,
    infinityEnd = true,
    vibrate = false,
    infinityTimeout,
    scrollTop,
    userSelectNone = false,
    hasGoTop = true,
    isMobile = true,
    children,
    refreshRender: RefreshRender,
    refreshingRender: RefreshingRender,
    refreshIconRender: RefreshIconRender,
    emptyRender: EmptyRender,
    infinityLabelRender: InfinityLabelRender,
    onRefresh,
    onInfinityFetch,
    onWheel,
    onScroll,
    onScrollTopChange,
    onScrollEnd,
    onInfinityFail
  } = props;

  // Refs
  const scrollFetchRef = useRef<HTMLDivElement>(null);
  const infinityTriggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const infinityTimeoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // State
  const [clientNonce, setClientNonce] = useState<string>('');
  const [infinityIsIntersecting, setInfinityIsIntersecting] =
    useState<boolean>(false);
  const [isPullStart, setIsPullStart] = useState<boolean>(false);
  const [isShowRefreshIcon, setIsShowRefreshIcon] = useState<boolean>(false);
  const [startY, setStartY] = useState<number>(0);
  const [moveDistance, setMoveDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [infinityTrigger, setInfinityTrigger] = useState<boolean>(false);
  const [infinityLoading, setInfinityLoading] = useState<boolean>(false);
  const [refreshIconAnimation, setRefreshIconAnimation] =
    useState<boolean>(false);
  const [refreshTriggerZIndex, setRefreshTriggerZIndex] = useState<number>(-1);
  const [refreshIconRotate, setRefreshIconRotate] = useState<number>(0);
  const [parentScrollIsTop, setParentScrollIsTop] = useState<boolean>(false);
  const [parentIsScrollIng, setParentIsScrollIng] = useState<boolean>(false);
  const [windowScrollIsTop, setWindowScrollIsTop] = useState<boolean>(false);
  const [windowIsScrollIng, setWindowIsScrollIng] = useState<boolean>(false);

  // Cleanup functions
  const removeParentScrollEndRef = useRef<(() => void) | null>(null);
  const removeWindowScrollEndRef = useRef<(() => void) | null>(null);

  // Computed values (useMemo)
  const cssVariable = useMemo<ScrollFetchCssVariable>(() => {
    const _cssVariable: ScrollFetchCssVariable = {};

    if (iosStyle === true) {
      _cssVariable['--refresh_icon_transform'] = 'translate3d(0, 0, 0)';
      _cssVariable['--refresh_transition'] = `${duration}ms`;
      _cssVariable['--refresh_transform'] =
        `translate3d(0, ${moveDistance}px, 0)`;

      if (typeof iosTypeIconSize === 'string') {
        _cssVariable['--refresh_ios_type_icon_size'] = iosTypeIconSize;
      } else if (typeof iosTypeIconSize === 'number') {
        _cssVariable['--refresh_ios_type_icon_size'] = `${iosTypeIconSize}px`;
      }

      if (typeof iosTypeIconStrokeWidth === 'string') {
        _cssVariable['--refresh_ios_type_icon_stroke_width'] =
          iosTypeIconStrokeWidth;
      } else if (typeof iosTypeIconStrokeWidth === 'number') {
        _cssVariable['--refresh_ios_type_icon_stroke_width'] =
          `${iosTypeIconStrokeWidth}px`;
      }
    } else {
      _cssVariable['--refresh_transform'] = 'translate3d(0, 0px, 0)';
      _cssVariable['--refresh_icon_transition'] = `${duration}ms`;
      _cssVariable['--refresh_icon_transform'] =
        `translate3d(0, ${moveDistance - 25}px, 0)`;
      _cssVariable['--refresh_icon_rotate'] = `rotate(${refreshIconRotate}deg)`;
    }

    if (typeof height === 'string' && height !== '') {
      _cssVariable['--refresh_height'] = height;
    } else if (typeof height === 'number') {
      _cssVariable['--refresh_height'] = `${height}px`;
    }

    if (typeof containerHeight === 'string' && containerHeight !== '') {
      _cssVariable['--refresh_container_height'] = containerHeight;
    } else if (typeof containerHeight === 'number') {
      _cssVariable['--refresh_container_height'] = `${containerHeight}px`;
    }

    if (userSelectNone === true) {
      _cssVariable['--refresh_user_select'] = 'none';
    }

    if (moveDistance > 0) {
      _cssVariable['--refresh_overflow'] = 'hidden';
      if (
        typeof document === 'object' &&
        typeof document.querySelector === 'function'
      ) {
        document.querySelector('html')?.classList.add('scroll_fetching');
      }
    } else {
      _cssVariable['--refresh_overflow'] = 'auto';
      if (
        typeof document === 'object' &&
        typeof document.querySelector === 'function'
      ) {
        document.querySelector('html')?.classList.remove('scroll_fetching');
      }
    }
    _cssVariable['--refresh_trigger_z_index'] = refreshTriggerZIndex.toString();

    return _cssVariable;
  }, [
    iosStyle,
    duration,
    moveDistance,
    userSelectNone,
    iosTypeIconSize,
    iosTypeIconStrokeWidth,
    refreshIconRotate,
    height,
    containerHeight,
    refreshTriggerZIndex
  ]);

  const hasRefreshIcon = useMemo<boolean>(() => {
    return typeof refreshIcon === 'string' && refreshIcon !== '';
  }, [refreshIcon]);

  const computedRefreshIcon = useMemo<string>(() => {
    return (
      (refreshing === true && isPullStart === false
        ? refreshingIcon
        : refreshIcon) ||
      refreshIcon ||
      ''
    );
  }, [refreshing, isPullStart, refreshingIcon, refreshIcon]);

  // Effects (equivalent to watchers)
  useEffect(() => {
    // console.log(JSON.stringify({ ScrollFetchNonce: nonce }));
  }, [nonce]);

  useEffect(() => {
    if (refreshing === false && duration === 300) {
      setMoveDistance(0);
      setRefreshIconRotate(0);
      setIsPulling(false);
    }
  }, [refreshing, duration]);

  useEffect(() => {
    if (loading === false) {
      setDuration(300);
      setTimeout(() => {
        setIsShowRefreshIcon(false);
        setMoveDistance(0);
        setRefreshIconRotate(0);
        setIsPulling(false);
      }, 300);
    }
  }, [loading]);

  useEffect(() => {
    createObserver(useObserver, infinityBuffer);
    handleCheckScroll(infinityBuffer);
  }, [infinityBuffer]);

  useEffect(() => {
    handleInfinityTrigger(
      infinityTrigger,
      infinityLoading,
      infinityDisable,
      infinityEnd
    );
  }, [infinityTrigger]);

  useEffect(() => {
    if (loading === false) {
      setDuration(300);
      requestAnimationFrame(() => {
        setIsShowRefreshIcon(false);
        setMoveDistance(0);
        setRefreshIconRotate(0);
        setIsPulling(false);
      });

      if (
        useObserver === false &&
        infinityDisable === false &&
        infinityEnd === false
      ) {
        handleCheckScroll(infinityBuffer);
      }
    }
  }, [loading, useObserver, infinityDisable, infinityEnd, infinityBuffer]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSyncScroll = useCallback(
    // TODO
    // eslint-disable-next-line react-hooks/use-memo
    _debounce((newScrollTop: number) => {
      if (typeof newScrollTop === 'number' && newScrollTop > -1) {
        scrollFetchRef.current?.scrollTo({
          top: newScrollTop,
          behavior: 'smooth'
        });
      }
    }, 50),
    []
  );

  useEffect(() => {
    if (scrollTop !== undefined) {
      handleSyncScroll(scrollTop);
    }
  }, [scrollTop, handleSyncScroll]);

  // Event handlers
  const handleInfinityFetch = useCallback(
    async function () {
      if (infinityLoading === true) {
        return;
      }

      if (typeof infinityTimeoutTimerRef.current === 'number') {
        clearTimeout(infinityTimeoutTimerRef.current);
      }

      setInfinityLoading(true);

      try {
        await new Promise<void>(async function (resolve, reject) {
          try {
            // 如果沒有正常觸發釋放事件，則由props.timeout自動釋放
            if (typeof infinityTimeout === 'number' && infinityTimeout > 0) {
              infinityTimeoutTimerRef.current = setTimeout(function () {
                clearTimeout(infinityTimeoutTimerRef.current!);
                infinityTimeoutTimerRef.current = null;
                reject(new Error('Infinity fetch timeout exceeded'));
              }, infinityTimeout);
            }

            if (typeof onInfinityFetch === 'function') {
              await onInfinityFetch();
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        console.error('ScrollFetch infinity fetch error:', error);
        onInfinityFail?.(error as Error);
      }

      if (typeof infinityTimeoutTimerRef.current === 'number') {
        clearTimeout(infinityTimeoutTimerRef.current);
        infinityTimeoutTimerRef.current = null;
      }
      setInfinityLoading(false);
    },
    [infinityLoading, infinityTimeout, onInfinityFetch, onInfinityFail]
  );

  const handleCheckScroll = useCallback(
    function (_infinityBuffer?: number) {
      const elementInfo = scrollFetchRef.current;

      if (!elementInfo) return;

      const scrollTop = elementInfo.scrollTop || 0;
      const scrollHeight = elementInfo.scrollHeight || 1;
      const height = elementInfo.clientHeight || 1;

      const bufferValue = _infinityBuffer || infinityBuffer || 0;
      const safeHeight = typeof height === 'number' ? height : 1;
      const safeScrollHeight =
        (typeof scrollHeight === 'number' ? scrollHeight : 1) - safeHeight;
      const safeScrollTop = typeof scrollTop === 'number' ? scrollTop : 0;

      const infinityLimit = safeScrollHeight - bufferValue;

      setInfinityTrigger(safeScrollTop >= infinityLimit);
    },
    [infinityBuffer]
  );

  const handleInfinityTrigger = useCallback(
    async function (
      currentInfinityTrigger = false,
      currentInfinityLoading = false,
      currentInfinityDisable = false,
      currentInfinityEnd = false
    ) {
      if (currentInfinityTrigger !== true) return;

      if (currentInfinityLoading !== true) {
        if (typeof infinityTimeoutTimerRef.current === 'number') {
          clearTimeout(infinityTimeoutTimerRef.current);
        }

        const timeoutValue =
          typeof infinityTimeout === 'number' && infinityTimeout > 0
            ? infinityTimeout
            : 100;

        infinityTimeoutTimerRef.current = setTimeout(async () => {
          clearTimeout(infinityTimeoutTimerRef.current!);
          infinityTimeoutTimerRef.current = null;
          setInfinityLoading(false);
        }, timeoutValue);
      }

      if (currentInfinityDisable === false && currentInfinityEnd === false) {
        await handleInfinityFetch();
      }

      if (useObserver === false) {
        handleCheckScroll(infinityBuffer);
      } else {
        setInfinityTrigger(false);
      }
    },
    [
      useObserver,
      infinityTimeout,
      handleInfinityFetch,
      handleCheckScroll,
      infinityBuffer
    ]
  );

  const handlePullStart = useCallback(
    function (e: TouchEvent | MouseEvent) {
      if (
        (windowIsScrollIng === true && windowScrollIsTop === false) ||
        (parentIsScrollIng === true && parentScrollIsTop === false) ||
        refreshDisable === true ||
        infinityLoading === true ||
        refreshing === true
      ) {
        return;
      }

      const scrollTop = scrollFetchRef.current?.scrollTop;
      if (scrollTop && scrollTop > 0) return;

      setIsPullStart(true);
      setDuration(0);
      setMoveDistance(0);
      setRefreshIconRotate(0);

      const touchEvent = e as TouchEvent;
      const mouseEvent = e as MouseEvent;

      setStartY(
        touchEvent.targetTouches?.[0]?.clientY ||
          touchEvent.targetTouches?.[0]?.pageY ||
          touchEvent.changedTouches?.[0]?.clientY ||
          touchEvent.changedTouches?.[0]?.pageY ||
          mouseEvent.clientY ||
          mouseEvent.pageY ||
          mouseEvent.screenY
      );
    },
    [
      windowIsScrollIng,
      windowScrollIsTop,
      parentIsScrollIng,
      parentScrollIsTop,
      refreshDisable,
      infinityLoading,
      refreshing
    ]
  );

  const handleRefreshDone = useCallback(
    async function () {
      setRefreshing(false);

      if (iosStyle === true) {
        setMoveDistance(0);
        setRefreshIconRotate(0);
        setIsPulling(false);
      }

      if (infinityIsIntersecting === true) {
        if (infinityTrigger === false) {
          setInfinityTrigger(true);
        } else {
          handleInfinityTrigger(
            infinityTrigger,
            infinityLoading,
            infinityDisable,
            infinityEnd
          );
        }
      }
    },
    [
      iosStyle,
      infinityIsIntersecting,
      infinityTrigger,
      infinityLoading,
      infinityDisable,
      infinityEnd,
      handleInfinityTrigger
    ]
  );

  const handlePullEnd = useCallback(
    // async function (e: TouchEvent | MouseEvent) {
    async function () {
      if (isPullStart === false) return;

      setIsPullStart(false);
      setStartY(0);
      setDuration(300);

      if (moveDistance <= 6) {
        setMoveDistance(0);
        setRefreshIconRotate(0);
        setRefreshTriggerZIndex(-1);
        setIsShowRefreshIcon(false);
      }

      if (
        refreshDisable === true ||
        refreshing === true ||
        infinityLoading === true
      ) {
        if (moveDistance > 6) {
          requestAnimationFrame(() => {
            setMoveDistance(0);
            setRefreshIconRotate(0);
          });
        }
        return;
      }

      if (moveDistance > MOVE_DISTANCE_LIMIT && isPulling === true) {
        setRefreshing(true);
        setIsPulling(false);
        if (iosStyle === true) {
          setMoveDistance(50);
        }
        if (typeof onRefresh === 'function') {
          await onRefresh();
        }
        handleRefreshDone();
      } else {
        setMoveDistance(0);
        setRefreshIconRotate(0);
      }
    },
    [
      isPullStart,
      moveDistance,
      refreshDisable,
      refreshing,
      infinityLoading,
      isPulling,
      iosStyle,
      onRefresh,
      handleRefreshDone
    ]
  );

  const handlePulling = useCallback(
    function (e: TouchEvent | MouseEvent) {
      if (
        (parentIsScrollIng === true && parentScrollIsTop === false) ||
        (windowIsScrollIng === true && windowScrollIsTop === false)
      ) {
        setMoveDistance(20);
        // handlePullEnd(e);
        handlePullEnd();
      } else if (
        isPullStart === false &&
        ((parentIsScrollIng === true && parentScrollIsTop === true) ||
          (windowIsScrollIng === true && windowScrollIsTop === true))
      ) {
        handlePullStart(e);
      }

      if (
        refreshDisable === true ||
        isPullStart !== true ||
        infinityLoading === true ||
        refreshing === true ||
        loading === true
      ) {
        return;
      }

      const scrollTop = scrollFetchRef.current?.scrollTop;
      if (scrollTop && scrollTop > 0) return;

      const touchEvent = e as TouchEvent;
      const mouseEvent = e as MouseEvent;

      const currentClientY =
        touchEvent.targetTouches?.[0]?.clientY ||
        touchEvent.targetTouches?.[0]?.pageY ||
        touchEvent.changedTouches?.[0]?.clientY ||
        touchEvent.changedTouches?.[0]?.pageY ||
        mouseEvent.clientY ||
        mouseEvent.pageY ||
        mouseEvent.screenY;
      const move = currentClientY - startY;

      if (startY > 0 && move > 0) {
        setIsShowRefreshIcon(true);
        if (iosStyle === false) {
          setRefreshTriggerZIndex(2);
        } else {
          setRefreshTriggerZIndex(0);
        }

        const _moveDistance = Math.pow(move, 0.8);

        if (_moveDistance < MOVE_DISTANCE_LIMIT + 5) {
          setMoveDistance(_moveDistance);
          setRefreshIconRotate(_moveDistance * 5.5);
        } else if (
          vibrate === true &&
          typeof window?.navigator?.vibrate === 'function' &&
          _moveDistance <= MOVE_DISTANCE_LIMIT + 4 &&
          _moveDistance >= MOVE_DISTANCE_LIMIT + 3
        ) {
          window.navigator.vibrate(100);
        }
        setIsPulling(_moveDistance > MOVE_DISTANCE_LIMIT);

        if (iosStyle === false) {
          setRefreshIconAnimation(_moveDistance > MOVE_DISTANCE_LIMIT);
        }
      }
    },
    [
      parentIsScrollIng,
      parentScrollIsTop,
      windowIsScrollIng,
      windowScrollIsTop,
      isPullStart,
      refreshDisable,
      infinityLoading,
      refreshing,
      loading,
      startY,
      handlePullEnd,
      handlePullStart,
      iosStyle,
      vibrate
    ]
  );

  const handleRefreshIcon = useCallback(
    function () {
      if (refreshing === false) {
        requestAnimationFrame(() => {
          setRefreshTriggerZIndex(-1);
          setIsShowRefreshIcon(false);
        });
      }
    },
    [refreshing]
  );

  const handleWheel = useCallback(
    function (e: WheelEvent) {
      onWheel?.(e);
    },
    [onWheel]
  );

  const handleScroll = useCallback(
    function (e: UIEvent<HTMLDivElement>) {
      // const target = e?.target || {};
      onScroll?.(e);

      handleCheckScroll(infinityBuffer);
    },
    [onScroll, handleCheckScroll, infinityBuffer]
  );

  // TODO
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScrollTop = useCallback(
    // TODO
    // eslint-disable-next-line react-hooks/use-memo
    _debounce(function (e: UIEvent<HTMLDivElement>) {
      if (typeof onScrollTopChange === 'function') {
        onScrollTopChange((e.target as HTMLDivElement)?.scrollTop || 0);
      }
    }, 50),
    [onScrollTopChange]
  );

  const handleScrollEnd = useCallback(
    function (e: UIEvent<HTMLDivElement>) {
      handleScrollTop(e);
      onScrollEnd?.(e);
      handleCheckScroll(infinityBuffer);
    },
    [handleScrollTop, onScrollEnd, handleCheckScroll, infinityBuffer]
  );

  const createObserver = useCallback(
    function (_useObserver?: boolean, _infinityBuffer?: number) {
      const observerValue =
        typeof _useObserver === 'boolean' ? _useObserver : useObserver;
      const bufferValue =
        typeof _infinityBuffer === 'number' ? _infinityBuffer : infinityBuffer;

      if (observerValue === true) {
        if (typeof observerRef.current?.observe === 'function') {
          observerRef.current.observe(infinityTriggerRef.current!);
        } else {
          observerRef.current = new IntersectionObserver(
            (entries) => {
              setInfinityIsIntersecting(entries[0].isIntersecting);
              if (entries[0].isIntersecting) {
                setInfinityTrigger(true);
              }
            },
            { rootMargin: `0px 0px ${bufferValue}px 0px` }
          );

          observerRef.current.observe(infinityTriggerRef.current!);
        }
      } else if (
        observerValue === false &&
        typeof observerRef.current?.unobserve === 'function' &&
        typeof infinityTriggerRef.current === 'object' &&
        infinityTriggerRef.current !== null
      ) {
        observerRef.current.unobserve(infinityTriggerRef.current);
      }
    },
    [useObserver, infinityBuffer]
  );

  const parentScroll = useCallback(function (e: Event) {
    if (e.target === scrollFetchRef.current || e.target === window) {
      if (e.target === scrollFetchRef.current) {
        setParentScrollIsTop(false);
        setParentIsScrollIng(false);
      }
      return;
    }

    setParentIsScrollIng(true);
    setParentScrollIsTop(
      (scrollFetchRef.current?.parentElement?.scrollTop || 0) <= 0
    );
  }, []);

  const parentScrollEnd = useCallback(function (e: Event) {
    if (e.target === scrollFetchRef.current || e.target === window) {
      return;
    }

    setParentIsScrollIng(false);
    setParentScrollIsTop(
      (scrollFetchRef.current?.parentElement?.scrollTop || 0) <= 0
    );
  }, []);

  const windowScroll = useCallback(function (e: Event) {
    if (e.target === scrollFetchRef.current) {
      setWindowScrollIsTop(false);
      setWindowIsScrollIng(false);
      return;
    }

    setWindowIsScrollIng(true);

    const scrollTriggerElement =
      // TODO
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e.target as any)?.body || (e.target as any)?.document?.body || e.target;
    const scrollTriggerElementBoundingClientRect =
      scrollTriggerElement?.getBoundingClientRect?.();

    setWindowScrollIsTop((scrollTriggerElementBoundingClientRect?.y || 0) <= 0);
  }, []);

  const windowScrollEnd = useCallback(function (e: Event) {
    setWindowIsScrollIng(false);

    const scrollElement =
      // TODO
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e.target as any)?.body || (e.target as any)?.document?.body || e.target;
    const scrollElementBoundingClientRect =
      scrollElement?.getBoundingClientRect?.();

    setWindowScrollIsTop((scrollElementBoundingClientRect?.y || 0) <= 0);
  }, []);

  // Lifecycle effects
  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);
  useEffect(() => {
    if (isMobile === true) {
      if (document instanceof Document) {
        const htmlDom = document.querySelector('html');
        if (htmlDom) {
          htmlDom.style.setProperty('--root_overscroll_behavior', 'none');
        }
      }

      if (
        typeof scrollFetchRef.current?.parentElement?.addEventListener ===
        'function'
      ) {
        scrollFetchRef.current.parentElement.addEventListener(
          'scroll',
          parentScroll
        );
        removeParentScrollEndRef.current = handleBindScrollEnd(
          scrollFetchRef.current.parentElement,
          parentScrollEnd
        );
      }
      window.addEventListener('scroll', windowScroll);
    }

    const handleContextMenu = () => {
      // Create a synthetic event for handlePullEnd
      // const syntheticEvent = {
      //   targetTouches: [],
      //   changedTouches: [],
      //   clientY: 0,
      //   pageY: 0,
      //   screenY: 0
      // } as unknown as TouchEvent | MouseEvent;
      // handlePullEnd(syntheticEvent);
      handlePullEnd();
    };

    window.addEventListener('contextmenu', handleContextMenu);

    removeWindowScrollEndRef.current = handleBindScrollEnd(
      window,
      windowScrollEnd
    );

    if (useObserver === true) {
      createObserver(useObserver);
    } else if (infinityDisable === false && infinityEnd === false) {
      handleCheckScroll(infinityBuffer);
    }

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);

      if (isMobile === true) {
        if (document instanceof Document) {
          const htmlDom = document.querySelector('html');
          if (htmlDom) {
            htmlDom.style.setProperty('--root_overscroll_behavior', '');
            htmlDom.style.removeProperty('--root_overscroll_behavior');
          }
        }

        window.removeEventListener('scroll', windowScroll);

        if (typeof removeWindowScrollEndRef.current === 'function') {
          removeWindowScrollEndRef.current();
        }

        if (typeof removeParentScrollEndRef.current === 'function') {
          removeParentScrollEndRef.current();
        }

        if (
          typeof observerRef.current?.unobserve === 'function' &&
          typeof infinityTriggerRef.current === 'object' &&
          infinityTriggerRef.current !== null
        ) {
          observerRef.current.unobserve(infinityTriggerRef.current);
        }
      }
    };
  }, [
    isMobile,
    useObserver,
    infinityDisable,
    infinityEnd,
    infinityBuffer,
    parentScroll,
    parentScrollEnd,
    windowScroll,
    windowScrollEnd,
    handlePullEnd,
    createObserver,
    handleCheckScroll
  ]);

  return (
    <div
      ref={scrollFetchRef}
      className={[className, styles.scroll_fetch, 'scroll_fetch'].join(' ')}
      nonce={clientNonce}
      style={cssVariable}
      onScrollEnd={handleScrollEnd}
      onMouseDown={handlePullStart}
      onMouseMove={handlePulling}
      onMouseUp={handlePullEnd}
      onTouchStart={handlePullStart}
      onTouchMove={handlePulling}
      onTouchEnd={handlePullEnd}
      onWheel={handleWheel}
      onScroll={handleScroll}
    >
      {refreshDisable === false && (
        <div className={styles['scroll_fetch-trigger']}>
          {iosStyle === true ? (
            refreshing === false ? (
              RefreshRender ? (
                // RefreshRender({ isPulling, isPullStart, isShowRefreshIcon })
                <RefreshRender
                  isPulling={isPulling}
                  isPullStart={isPullStart}
                  isShowRefreshIcon={isShowRefreshIcon}
                />
              ) : (
                <p
                  className={styles['scroll_fetch-trigger-pull_label']}
                  nonce={clientNonce}
                  style={{ display: isShowRefreshIcon ? 'block' : 'none' }}
                >
                  {isPulling === true ? pullingLabel : pullLabel}
                </p>
              )
            ) : RefreshingRender ? (
              // refreshingRender()
              <RefreshingRender />
            ) : (
              <div className={styles['scroll_fetch-trigger-refreshing']}>
                <div
                  className={
                    styles['scroll_fetch-trigger-refreshing-loading_icon']
                  }
                  css-refresh-animation="true"
                />
                <p className={styles['scroll_fetch-trigger-refreshing-label']}>
                  {loadingLabel}
                </p>
              </div>
            )
          ) : (
            <div
              className={styles['scroll_fetch-trigger-icon_center']}
              onTransitionEnd={handleRefreshIcon}
            >
              {RefreshIconRender ? (
                // RefreshIconRender({ isShowRefreshIcon, isPullStart })
                <RefreshIconRender
                  isShowRefreshIcon={isShowRefreshIcon}
                  isPullStart={isPullStart}
                />
              ) : (
                <>
                  {hasRefreshIcon === false ? (
                    <div
                      className={
                        styles['scroll_fetch-trigger-icon_center-icon']
                      }
                      css-is-visible={isShowRefreshIcon ? 'true' : 'false'}
                      css-refresh-animation={`${refreshing === true && isPullStart === false}`}
                    />
                  ) : (
                    <div
                      css-is-visible={isShowRefreshIcon ? 'true' : 'false'}
                      className={
                        styles['scroll_fetch-trigger-icon_center-icon_img_bg']
                      }
                      css-activate-animation={`${refreshIconAnimation}`}
                    >
                      <Image
                        src={computedRefreshIcon}
                        css-refresh-animation={`${refreshing === true && isPullStart === false}`}
                        className={
                          styles[
                            'scroll_fetch-trigger-icon_center-icon_img_bg-icon_img'
                          ]
                        }
                        width={23}
                        height={23}
                        alt="scroll fetch icon"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {isEmpty === false && (
        <div
          className={styles['scroll_fetch-container']}
          onMouseOver={handlePullEnd}
          onTransitionEnd={handleRefreshIcon}
        >
          {children}
        </div>
      )}

      {isEmpty === true && (
        <div className={styles['scroll_fetch-empty']}>
          {EmptyRender ? (
            // EmptyRender()
            <EmptyRender />
          ) : (
            <p className={styles['scroll_fetch-empty-label']}>{emptyLabel}</p>
          )}
        </div>
      )}

      <div ref={infinityTriggerRef} />

      {infinityDisable === false &&
        (InfinityLabelRender ? (
          // InfinityLabelRender({ loading: infinityLoading, infinityEnd })
          <InfinityLabelRender
            loading={infinityLoading}
            infinityEnd={infinityEnd}
          />
        ) : (
          <p className={styles['scroll_fetch-infinity_label']}>
            {infinityEnd === false
              ? infinityLoading === true
                ? loadingLabel
                : infinityLabel
              : infinityEndLabel}
          </p>
        ))}

      {hasGoTop === true ? (
        <GoTop
          position="sticky"
          right="unset"
          left="90%"
          parentElementTrigger={true}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default ScrollFetch;
