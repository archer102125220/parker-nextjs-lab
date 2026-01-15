import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useEffectEvent
} from 'react';

/**
 * WebRTC 設定選項
 */
export interface UseWebRTCOptions {
  /**
   * ICE 伺服器設定
   */
  iceServers?: RTCIceServer[];
  /**
   * 本地媒體串流
   */
  localStream?: MediaStream | null;
  /**
   * ICE candidate 回調
   */
  onIceCandidate?: (candidate: RTCIceCandidate) => void;
  /**
   * 收到遠端串流回調
   */
  onRemoteStream?: (stream: MediaStream) => void;
  /**
   * 連線狀態變更回調
   */
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  /**
   * ICE 連線狀態變更回調
   */
  onIceConnectionStateChange?: (state: RTCIceConnectionState) => void;
}

/**
 * WebRTC Hook 回傳值
 */
export interface UseWebRTCReturn {
  /**
   * RTCPeerConnection 實例（使用函式取得以避免 hydration 問題）
   */
  getPeerConnection: () => RTCPeerConnection | null;
  /**
   * ICE 連線狀態
   */
  iceConnectionState: RTCIceConnectionState | null;
  /**
   * 連線狀態
   */
  connectionState: RTCPeerConnectionState | null;
  /**
   * 遠端串流列表
   */
  remoteStreams: MediaStream[];
  /**
   * 建立 Offer
   */
  createOffer: () => Promise<RTCSessionDescriptionInit | null>;
  /**
   * 建立 Answer
   */
  createAnswer: () => Promise<RTCSessionDescriptionInit | null>;
  /**
   * 設定本地描述
   */
  setLocalDescription: (
    description: RTCSessionDescriptionInit
  ) => Promise<void>;
  /**
   * 設定遠端描述
   */
  setRemoteDescription: (
    description: RTCSessionDescriptionInit
  ) => Promise<void>;
  /**
   * 新增 ICE Candidate
   */
  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
  /**
   * 新增本地串流
   */
  addLocalStream: (stream: MediaStream) => void;
  /**
   * 關閉連線
   */
  close: () => void;
}

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' }
];

/**
 * WebRTC Hook
 *
 * 封裝 RTCPeerConnection 的常用操作
 *
 * @example
 * const {
 *   getPeerConnection,
 *   createOffer,
 *   createAnswer,
 *   setRemoteDescription,
 *   addIceCandidate,
 *   remoteStreams
 * } = useWebRTC({
 *   localStream: myLocalStream,
 *   onIceCandidate: (candidate) => send('iceCandidate', candidate),
 *   onRemoteStream: (stream) => console.log('Got remote stream'),
 * });
 */
export function useWebRTC(options: UseWebRTCOptions = {}): UseWebRTCReturn {
  const {
    iceServers = DEFAULT_ICE_SERVERS,
    localStream = null,
    onIceCandidate,
    onRemoteStream,
    onConnectionStateChange,
    onIceConnectionStateChange
  } = options;

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [iceConnectionState, setIceConnectionState] =
    useState<RTCIceConnectionState | null>(null);
  const [connectionState, setConnectionState] =
    useState<RTCPeerConnectionState | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  // Use useEffectEvent for stable handlers
  const handleIceCandidate = useEffectEvent((candidate: RTCIceCandidate) => {
    onIceCandidate?.(candidate);
  });

  const handleRemoteStream = useEffectEvent((stream: MediaStream) => {
    onRemoteStream?.(stream);
  });

  const handleConnectionStateChange = useEffectEvent(
    (state: RTCPeerConnectionState) => {
      onConnectionStateChange?.(state);
    }
  );

  const handleIceConnectionStateChange = useEffectEvent(
    (state: RTCIceConnectionState) => {
      onIceConnectionStateChange?.(state);
    }
  );

  /**
   * 新增本地串流
   */
  const addLocalStream = useCallback((stream: MediaStream) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    stream.getTracks().forEach((track) => {
      // 檢查是否已經加入過這個 track
      const senders = pc.getSenders();
      const existingSender = senders.find((s) => s.track?.id === track.id);
      if (!existingSender) {
        pc.addTrack(track, stream);
      }
    });
  }, []);

  // Initialize RTCPeerConnection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // cleanup previous connection if exists
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    let pc: RTCPeerConnection | null = null;

    const init = () => {
      const config: RTCConfiguration = { iceServers };
      pc = new RTCPeerConnection(config);

      // ICE Candidate 事件
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          handleIceCandidate(event.candidate);
        }
      };

      // ICE 連線狀態變更
      pc.oniceconnectionstatechange = () => {
        setIceConnectionState(pc!.iceConnectionState);
        handleIceConnectionStateChange(pc!.iceConnectionState);
      };

      // 連線狀態變更
      pc.onconnectionstatechange = () => {
        setConnectionState(pc!.connectionState);
        handleConnectionStateChange(pc!.connectionState);
      };

      // 收到遠端串流
      pc.ontrack = (event) => {
        if (event.streams && event.streams.length > 0) {
          // 先取得新的串流，再更新狀態
          const newStreams = event.streams;
          newStreams.forEach((stream) => handleRemoteStream(stream));

          setRemoteStreams((prev) => {
            const filteredNewStreams = newStreams.filter(
              (stream) => !prev.some((s) => s.id === stream.id)
            );
            if (filteredNewStreams.length > 0) {
              return [...prev, ...filteredNewStreams];
            }
            return prev;
          });
        }
      };

      peerConnectionRef.current = pc;
      setConnectionState(pc.connectionState);
      setIceConnectionState(pc.iceConnectionState);

      // Add local stream if exists
      if (localStream) {
        addLocalStream(localStream);
      }
    };

    // Defer initialization to avoid set-state-in-effect issues
    const timeoutId = setTimeout(init, 0);

    return () => {
      clearTimeout(timeoutId);
      if (pc) {
        pc.close();
      }
      if (peerConnectionRef.current === pc) {
        peerConnectionRef.current = null;
      }
      setConnectionState(null);
      setIceConnectionState(null);
      setRemoteStreams([]);
    };
  }, [iceServers, localStream, addLocalStream]); // Re-init if iceServers or localStream changes

  /**
   * 取得 PeerConnection 實例
   */
  const getPeerConnection = useCallback(() => {
    return peerConnectionRef.current;
  }, []);

  /**
   * 建立 Offer
   */
  const createOffer =
    useCallback(async (): Promise<RTCSessionDescriptionInit | null> => {
      const pc = peerConnectionRef.current;
      if (!pc) return null;

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        return offer;
      } catch (err) {
        console.error('[useWebRTC] createOffer error:', err);
        return null;
      }
    }, []);

  /**
   * 建立 Answer
   */
  const createAnswer =
    useCallback(async (): Promise<RTCSessionDescriptionInit | null> => {
      const pc = peerConnectionRef.current;
      if (!pc) return null;

      try {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        return answer;
      } catch (err) {
        console.error('[useWebRTC] createAnswer error:', err);
        return null;
      }
    }, []);

  /**
   * 設定本地描述
   */
  const setLocalDescriptionFn = useCallback(
    async (description: RTCSessionDescriptionInit) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      try {
        await pc.setLocalDescription(description);
      } catch (err) {
        console.error('[useWebRTC] setLocalDescription error:', err);
      }
    },
    []
  );

  /**
   * 設定遠端描述
   */
  const setRemoteDescriptionFn = useCallback(
    async (description: RTCSessionDescriptionInit) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(description));
      } catch (err) {
        console.error('[useWebRTC] setRemoteDescription error:', err);
      }
    },
    []
  );

  /**
   * 新增 ICE Candidate
   */
  const addIceCandidateFn = useCallback(
    async (candidate: RTCIceCandidateInit) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('[useWebRTC] addIceCandidate error:', err);
      }
    },
    []
  );

  /**
   * 關閉連線
   */
  const close = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
      setConnectionState(null);
      setIceConnectionState(null);
      setRemoteStreams([]);
    }
  }, []);

  return {
    getPeerConnection,
    iceConnectionState,
    connectionState,
    remoteStreams,
    createOffer,
    createAnswer,
    setLocalDescription: setLocalDescriptionFn,
    setRemoteDescription: setRemoteDescriptionFn,
    addIceCandidate: addIceCandidateFn,
    addLocalStream,
    close
  };
}

export default useWebRTC;
