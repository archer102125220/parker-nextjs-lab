import { useState, useEffect, type RefObject } from 'react';

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

interface playerInterface {
  destroy?: () => void;
  getPlayerState?: () => number;
  loadVideoById?: (videoId: string, startSeconds?: number) => void;
  loadVideoByUrl?: (
    mediaContentUrl: string,
    startSeconds?: number,
    endSeconds?: number
  ) => void;
}

interface eventsKeyInterface {
  [key: string | number]: undefined | null | string;
  [UNSTARTED]: 'unstarted';
  [PLAYING]: 'playing';
  [PAUSED]: 'paused';
  [ENDED]: 'ended';
  [BUFFERING]: 'buffering';
  [CUED]: 'cued';
}

/**
 * A Youtube API hook.
 *
 * @hook
 * @param {HTMLElement} el
 * @param {object} options
 * @param {function} options.beforeCreate -
 * @param {string} options.videoId -
 * @param {string} options.videoUrl -
 * @param {function} options.onYouTubeIframeAPIReady -
 * @param {function} options.destroy -
 * @param {function} options.loadVideoById -
 * @param {function} options.loadVideoByUrl -
 * @param {object} options.events -
 * @param {function} options.created -
 * @param {function} options.events.onReady -
 * @returns {{player: HTMLElement, youtubePlayerInstance: Object, getPlayerState: function, el: { current: HTMLElement } }}
 *
 * @example
 * // 帶入videoId
 *  const youtbue = useYoutube(dom, { videoId: 'W8p5RPTPsoU' });
 */

export function useYoutube(
  el: RefObject<HTMLElement>,
  options: YoutubeOptions = {}
) {
  const [player, setPlayer] = useState<playerInterface | null>(null);
  const [youtubePlayerInstance, setYoutubePlayerInstance] = useState(null);
  const [eventsKey] = useState<eventsKeyInterface>({
    [UNSTARTED]: 'unstarted',
    [PLAYING]: 'playing',
    [PAUSED]: 'paused',
    [ENDED]: 'ended',
    [BUFFERING]: 'buffering',
    [CUED]: 'cued'
  });

  useEffect(() => {
    if (typeof options?.beforeCreate === 'function') {
      options.beforeCreate();
    }
    if (document.getElementById('youtube-script') === null) {
      const youtubeScript = document.createElement('script');
      youtubeScript.setAttribute('id', 'youtube-script');
      youtubeScript.setAttribute('src', 'https://www.youtube.com/iframe_api');
      youtubeScript.setAttribute('async', '');
      youtubeScript.setAttribute('defer', '');

      if (typeof options?.nonce === 'string' && options?.nonce !== '') {
        youtubeScript.setAttribute('nonce', options.nonce);
      }

      document.body.appendChild(youtubeScript);
      // TODO
      // eslint-disable-next-line react-hooks/immutability
      init();
    } else if (
      ((typeof options?.videoId === 'string' && options?.videoId !== '') ||
        (typeof options?.videoUrl === 'string' && options?.videoUrl !== '')) &&
      typeof window.onYouTubeIframeAPIReady === 'function'
    ) {
      // TODO
      // eslint-disable-next-line react-hooks/immutability
      createPlayer(null);
    }

    return function () {
      if (typeof player?.destroy === 'function') {
        player.destroy();
        setPlayer(null);
        setYoutubePlayerInstance(null);
        window.youTubeIsCreated = false;
      }
    };
  }, [el]);
  useEffect(() => {
    if (
      typeof player?.loadVideoById === 'function' &&
      typeof options?.videoId === 'string' &&
      options?.videoId !== ''
    ) {
      // player.loadVideoById(videoId:String, startSeconds:Number):Void
      player.loadVideoById(options.videoId, options.startSeconds);
    } else if (
      typeof player?.loadVideoByUrl === 'function' &&
      typeof options?.videoUrl === 'string' &&
      options?.videoUrl !== ''
    ) {
      // player.loadVideoByUrl(mediaContentUrl:String, startSeconds?:Number, endSeconds?:Number):Void
      player.loadVideoByUrl(
        options.videoUrl,
        options.startSeconds,
        options.endSeconds
      );
    }
  }, [player, options]);

  function init() {
    window.onYouTubeIframeAPIReady = (...arg) => {
      createPlayer(null, ...arg);
    };
  }

  function createPlayer(_el: HTMLElement | null) {
    const YoutubeRefEl = _el || el.current;

    if (window.YT?.Player) {
      const events: YoutubeOptions['events'] = {
        ...(options?.events || {}),
        onReady: playerReady
      };
      const _player = new window.YT.Player(YoutubeRefEl as HTMLElement, {
        ...options,
        events
      });
      setYoutubePlayerInstance(_player);
      // TODO
      // eslint-disable-next-line react-hooks/immutability
      window.youTubeIsCreated = true;
      if (typeof options?.created === 'function') {
        options.created(_player, YoutubeRefEl as HTMLElement, window.YT);
      }
    } else if (
      (typeof options?.videoId === 'string' && options?.videoId !== '') ||
      (typeof options?.videoUrl === 'string' && options?.videoUrl !== '')
    ) {
      setTimeout(() => createPlayer(YoutubeRefEl), 500);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function playerReady(e: any, ...arg: any[]) {
    const youtubePlayer = e.target;
    setPlayer(youtubePlayer);
    if (typeof options?.events?.onReady === 'function') {
      options.events.onReady(e, ...arg);
    }
  }

  return {
    player,
    youtubePlayerInstance,
    eventsKey,
    getPlayerState() {
      const playerState = player?.getPlayerState?.() || '';
      return eventsKey[playerState] || playerState;
    },
    el,
    youtubeApi: typeof window === 'object' ? window.YT : null
  };
}

export default useYoutube;
