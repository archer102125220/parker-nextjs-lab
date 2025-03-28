import { useState, useEffect } from 'react';

const UNSTARTED = -1;
const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;
const BUFFERING = 3;
const CUED = 5;

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
export function useYoutube(el, options = {}) {
  const [player, setPlayer] = useState(null);
  const [youtubePlayerInstance, setYoutubePlayerInstance] = useState(null);
  const [events] = useState({
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
      const el = document.createElement('script');
      el.setAttribute('id', 'youtube-script');
      el.setAttribute('src', 'https://www.youtube.com/iframe_api');
      el.setAttribute('async', '');
      el.setAttribute('defer', '');
      document.body.appendChild(el);
      init();
    } else if (
      ((typeof options?.videoId === 'string' && options?.videoId !== '') ||
        (typeof options?.videoUrl === 'string' && options?.videoUrl !== '')) &&
      typeof window.onYouTubeIframeAPIReady === 'function'
    ) {
      createPlayer();
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
  function createPlayer(_el) {
    const YoutubeRefEl = _el || el.current;

    if (window.YT?.Player) {
      const events = {
        ...(options?.events || {}),
        onReady: playerReady
      };
      const _player = new window.YT.Player(YoutubeRefEl, {
        ...options,
        events
      });
      setYoutubePlayerInstance(_player);
      window.youTubeIsCreated = true;
      if (typeof options?.created === 'function') {
        options.created(_player, YoutubeRefEl, window.YT);
      }
    } else if (
      (typeof options?.videoId === 'string' && options?.videoId !== '') ||
      (typeof options?.videoUrl === 'string' && options?.videoUrl !== '')
    ) {
      setTimeout(() => createPlayer(YoutubeRefEl), 500);
    }
  }
  function playerReady(e, ...arg) {
    const youtubePlayer = e.target;
    setPlayer(youtubePlayer);
    if (typeof options?.events?.onReady === 'function') {
      options.events.onReady(e, ...arg);
    }
  }

  return {
    player,
    youtubePlayerInstance,
    events,
    getPlayerState() {
      const playerState = player.getPlayerState();
      return events[playerState] || playerState;
    },
    el,
    youtubeApi: typeof window === 'object' ? window.YT : null
  };
}
