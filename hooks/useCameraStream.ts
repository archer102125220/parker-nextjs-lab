'use client';

import { useRef, useEffect, useLayoutEffect, useCallback, useState } from 'react';

export interface UseCameraStreamOptions {
  /** Enable audio stream */
  audio?: boolean;
  /** Video constraints or boolean */
  video?: boolean | MediaTrackConstraints;
  /** Camera facing mode */
  facingMode?: 'user' | 'environment';
  /** Auto-start camera on mount */
  autoStart?: boolean;
}

export interface UseCameraStreamReturn {
  /** The camera stream object */
  stream: MediaStream | null;
  /** Whether the camera is active */
  isActive: boolean;
  /** Error message if any */
  error: string | null;
  /** Start the camera stream */
  start: () => Promise<void>;
  /** Stop the camera stream */
  stop: () => void;
}

/**
 * useCameraStream - A React hook for accessing the camera stream
 *
 * @param options - Camera options (audio, video, facingMode, autoStart)
 * @param onReady - Callback when stream is ready
 * @param onError - Callback when error occurs
 * @returns Object containing stream, status, and control functions
 *
 * @example
 * ```tsx
 * const { stream, isActive, error, start, stop } = useCameraStream(
 *   { video: true, audio: false, autoStart: true },
 *   (stream) => console.log('Camera ready'),
 *   (error) => console.error('Camera error', error)
 * );
 * ```
 */
export function useCameraStream(
  options: UseCameraStreamOptions = {},
  onReady?: (stream: MediaStream) => void,
  onError?: (error: Error) => void
): UseCameraStreamReturn {
  const {
    autoStart = true,
    audio = false,
    video = true,
    facingMode = 'user'
  } = options;

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  const optionsRef = useRef({ audio, video, facingMode });

  // Keep refs updated (useLayoutEffect ensures immediate update)
  useLayoutEffect(() => {
    onReadyRef.current = onReady;
    onErrorRef.current = onError;
    optionsRef.current = { audio, video, facingMode };
  }, [onReady, onError, audio, video, facingMode]);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
      setStream(null);
      setIsActive(false);
    }
  }, []);

  const startStream = useCallback(async () => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        streamRef.current = null;
      }
      setError(null);

      const {
        audio: currentAudio,
        video: currentVideo,
        facingMode: currentFacingMode
      } = optionsRef.current;

      const constraints: MediaStreamConstraints = {
        audio: currentAudio,
        video:
          typeof currentVideo === 'boolean'
            ? currentVideo
              ? { facingMode: currentFacingMode }
              : false
            : { ...currentVideo, facingMode: currentFacingMode }
      };

      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsActive(true);

      if (onReadyRef.current) {
        onReadyRef.current(mediaStream);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to access camera';
      setError(errorMessage);
      setIsActive(false);

      if (onErrorRef.current && err instanceof Error) {
        onErrorRef.current(err);
      }
    }
  }, []);

  // Auto-start on mount if enabled
  useEffect(() => {
    let mounted = true;

    if (autoStart) {
      // Use IIFE to handle async
      (async () => {
        if (mounted) {
          await startStream();
        }
      })();
    }

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [autoStart, startStream]);

  return {
    stream,
    isActive,
    error,
    start: startStream,
    stop: stopStream
  };
}

export default useCameraStream;


