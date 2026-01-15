import { useState, useEffect, useEffectEvent, useRef, useMemo, type RefObject } from 'react';

const UNSTARTED = -1;
const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;
const BUFFERING = 3;
const CUED = 5;

export interface YoutubeOptions {
  nonce?: string;
  beforeCreate?: () => void;
  videoId?: string;
  videoUrl?: string;
  onYouTubeIframeAPIReady?: () => void;
  destroy?: () => void;
  loadVideoById?: (videoId: string, startSeconds?: number) => void;
  loadVideoByUrl?: (
    mediaContentUrl: string,
    startSeconds?: number,
    endSeconds?: number
  ) => void;
  events?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onReady?: (event: any, ...arg: any[]) => void;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  created?: (player: any, el: HTMLElement, YT: any) => void;
  startSeconds?: number;
  endSeconds?: number;
}

interface PlayerInterface {
  destroy?: () => void;
  getPlayerState?: () => number;
  loadVideoById?: (videoId: string, startSeconds?: number) => void;
  loadVideoByUrl?: (
    mediaContentUrl: string,
    startSeconds?: number,
    endSeconds?: number
  ) => void;
}

/**
 * useYoutube - A hook for integrating YouTube IFrame API
 *
 * @param el - Ref to the container element
 * @param options - YouTube player options
 * @returns Object containing player instance and control methods
 *
 * @example
 * const youtubeRef = useRef<HTMLDivElement>(null);
 * const { player, getPlayerState } = useYoutube(youtubeRef, { videoId: 'W8p5RPTPsoU' });
 */
export function useYoutube(
  el: RefObject<HTMLElement>,
  options: YoutubeOptions = {}
) {
  const [player, setPlayer] = useState<PlayerInterface | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [youtubePlayerInstance, setYoutubePlayerInstance] = useState<any>(null);
  const playerRef = useRef<PlayerInterface | null>(null);
  const optionsRef = useRef(options);

  // Keep optionsRef updated
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Memoize eventsKey to avoid recreating on each render
  const eventsKey = useMemo(() => ({
    [UNSTARTED]: 'unstarted' as const,
    [PLAYING]: 'playing' as const,
    [PAUSED]: 'paused' as const,
    [ENDED]: 'ended' as const,
    [BUFFERING]: 'buffering' as const,
    [CUED]: 'cued' as const
  }), []);

  // Use useEffectEvent for all callbacks to avoid them as dependencies
  const onBeforeCreate = useEffectEvent(() => {
    if (typeof options.beforeCreate === 'function') {
      options.beforeCreate();
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCreated = useEffectEvent((playerInstance: any, element: HTMLElement, YT: any) => {
    if (typeof options.created === 'function') {
      options.created(playerInstance, element, YT);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPlayerReady = useEffectEvent((event: any, ...args: any[]) => {
    if (typeof options.events?.onReady === 'function') {
      options.events.onReady(event, ...args);
    }
  });

  // Main initialization effect
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const element = el.current;
    if (!element) return;

    // Call beforeCreate callback
    onBeforeCreate();

    let timeoutId: NodeJS.Timeout | null = null;
    let isCleanedUp = false;

    // Player ready handler - defined inside effect so it can use useEffectEvent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePlayerReady = (e: any, ...args: any[]) => {
      if (isCleanedUp) return;
      const youtubePlayer = e.target;
      playerRef.current = youtubePlayer;
      setPlayer(youtubePlayer);
      onPlayerReady(e, ...args);
    };

    // Create player function - defined inside effect
    const createPlayer = (targetEl: HTMLElement | null) => {
      if (isCleanedUp) return;

      const youtubeRefEl = targetEl || element;

      if (window.YT?.Player) {
        const events = {
          ...(options.events || {}),
          onReady: handlePlayerReady
        };

        const playerInstance = new window.YT.Player(youtubeRefEl, {
          ...options,
          events
        });

        setYoutubePlayerInstance(playerInstance);
        window.youTubeIsCreated = true;
        onCreated(playerInstance, youtubeRefEl, window.YT);
      } else if (
        (typeof optionsRef.current.videoId === 'string' && optionsRef.current.videoId !== '') ||
        (typeof optionsRef.current.videoUrl === 'string' && optionsRef.current.videoUrl !== '')
      ) {
        // Retry if YT API not ready yet
        timeoutId = setTimeout(() => createPlayer(youtubeRefEl), 500);
      }
    };

    // Check if script already exists
    if (document.getElementById('youtube-script') === null) {
      // Create and append YouTube API script
      const youtubeScript = document.createElement('script');
      youtubeScript.setAttribute('id', 'youtube-script');
      youtubeScript.setAttribute('src', 'https://www.youtube.com/iframe_api');
      youtubeScript.setAttribute('async', '');
      youtubeScript.setAttribute('defer', '');

      if (typeof options.nonce === 'string' && options.nonce !== '') {
        youtubeScript.setAttribute('nonce', options.nonce);
      }

      document.body.appendChild(youtubeScript);

      // Set global callback for when API is ready
      window.onYouTubeIframeAPIReady = () => {
        if (!isCleanedUp) {
          createPlayer(null);
        }
      };
    } else if (
      ((typeof optionsRef.current.videoId === 'string' && optionsRef.current.videoId !== '') ||
        (typeof optionsRef.current.videoUrl === 'string' && optionsRef.current.videoUrl !== '')) &&
      typeof window.onYouTubeIframeAPIReady === 'function'
    ) {
      // Script exists and API is ready, create player directly
      createPlayer(null);
    }

    // Cleanup
    return () => {
      isCleanedUp = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (typeof playerRef.current?.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
        setPlayer(null);
        setYoutubePlayerInstance(null);
        window.youTubeIsCreated = false;
      }
    };
  }, [el, options.nonce]);

  // Effect to handle video changes after player is initialized
  useEffect(() => {
    if (!player) return;

    if (
      typeof player.loadVideoById === 'function' &&
      typeof options.videoId === 'string' &&
      options.videoId !== ''
    ) {
      player.loadVideoById(options.videoId, options.startSeconds);
    } else if (
      typeof player.loadVideoByUrl === 'function' &&
      typeof options.videoUrl === 'string' &&
      options.videoUrl !== ''
    ) {
      player.loadVideoByUrl(
        options.videoUrl,
        options.startSeconds,
        options.endSeconds
      );
    }
  }, [player, options.videoId, options.videoUrl, options.startSeconds, options.endSeconds]);

  return {
    player,
    youtubePlayerInstance,
    eventsKey,
    getPlayerState() {
      const playerState = player?.getPlayerState?.() ?? '';
      return eventsKey[playerState as keyof typeof eventsKey] || playerState;
    },
    el,
    youtubeApi: typeof window === 'object' ? window.YT : null
  };
}

export default useYoutube;

