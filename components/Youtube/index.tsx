'use client';
// https://developers.google.com/youtube/iframe_api_reference?hl=zh-tw
import type { RefObject, Ref } from 'react';
import { useRef, useImperativeHandle } from 'react';

import { useYoutube } from '@/hooks/useYoutube';

import styles from '@/components/Youtube/youtube.module.scss';

type YoutubeHandle = { youtbue: ReturnType<typeof useYoutube> };

interface YoutubeProps {
  videoId?: string;
  videoUrl?: string;
  playerVars?: Record<string, unknown>;
  autoplay?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReady?: (player: any, event: any, ...args: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onStateChange?: (...args: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (...args: any[]) => void;
  onBeforeCreate?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCreated?: (player: any, el: HTMLElement, YT: any) => void;
  instanceRef?: Ref<YoutubeHandle>;
}

/**
 * A Youtube component.
 *
 * @component
 * @param {Object} props
 * @param {string} props.videoId -
 * @param {string} props.videoUrl -
 * @param {Object} props.playerVars -
 * @param {bool} props.autoplay -
 * @param {function} props.onReady -
 * @param {function} props.onStateChange -
 * @param {function} props.onError -
 * @param {function} props.onBeforeCreate -
 * @param {function} props.onCreated -
 * @returns {JSX.Element} The rendered button component.
 *
 * @example
 * // 帶入videoId
 * <Youtube videoId="W8p5RPTPsoU" />
 */
export function Youtube(props: YoutubeProps) {
  const {
    videoId = '',
    videoUrl = '',
    playerVars = {
      rel: 0,
      controls: 1,
      showinfo: 0,
      enablejsapi: 1,
      wmode: 'opaque'
    },
    autoplay = false,
    onReady = () => {},
    onStateChange = () => {},
    onError = () => {},
    onBeforeCreate = () => {},
    onCreated = () => {},
    instanceRef
  } = props;

  const YoutubeRef = useRef<HTMLDivElement | null>(null);
  const youtbue = useYoutube(
    YoutubeRef as unknown as RefObject<HTMLElement>,
    {
      videoId,
      videoUrl,
      playerVars,
      events: {
        onReady: playerReady,
        onStateChange,
        onError,
        beforeCreate: onBeforeCreate,
        created: onCreated
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  );

  useImperativeHandle(instanceRef, () => ({ youtbue }), [youtbue]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function playerReady(e: any, ...arg: any[]) {
    const youtubePlayer = e.target;
    if (
      // !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      //   navigator.userAgent
      // ) &&
      autoplay === true
    ) {
      // https://tutorials.webduino.io/zh-tw/docs/socket/useful/youtube.html
      youtubePlayer.seekTo(0);
    }
    if (typeof onReady === 'function') {
      onReady(youtubePlayer, e, ...arg);
    }
  }

  return <div className={styles.youtube_root} ref={YoutubeRef} />;
}

export default Youtube;
