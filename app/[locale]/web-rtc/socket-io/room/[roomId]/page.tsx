'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Typography,
  Alert,
  Paper,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import CheckIcon from '@mui/icons-material/Check';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';

import { useSocketIoClient } from '@/hooks/useSocketIoClient';
import { useWebRTC } from '@/hooks/useWebRTC';

import '@/app/[locale]/web-rtc/web-rtc.scss';

export default function WebRTCSocketIORoomPage(): React.ReactNode {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const roomId = params?.roomId as string;

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const isOfferRef = useRef(false);

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // WebRTC - 先定義，讓 Socket.IO listeners 可以使用
  const {
    iceConnectionState,
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate,
    addLocalStream,
    remoteStreams,
    close: closeWebRTC
  } = useWebRTC({
    localStream,
    onIceCandidate: (candidate) => {
      console.log('[WebRTC] Sending ICE candidate');
      socketRef.current?.emit('webrtcCandidate', candidate.toJSON());
    },
    onRemoteStream: (stream) => {
      console.log('[WebRTC] Remote stream received');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    },
    onIceConnectionStateChange: (state) => {
      console.log('[WebRTC] ICE connection state:', state);
    }
  });

  // 保存 WebRTC 函數的 refs，讓 Socket listeners 可以動態獲取
  const webRTCRef = useRef({
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate
  });

  // 在 effect 中更新 ref 以避免 render 期間更新
  useEffect(() => {
    webRTCRef.current = {
      createOffer,
      createAnswer,
      setRemoteDescription,
      addIceCandidate
    };
  }, [createOffer, createAnswer, setRemoteDescription, addIceCandidate]);

  // Socket ref for ICE candidate sending
  const socketRef =
    useRef<
      ReturnType<typeof useSocketIoClient>['getSocket'] extends () => infer T
        ? T
        : never
    >(null);

  // Socket.IO signaling
  const {
    isConnected: isSocketConnected,
    emit,
    getSocket
  } = useSocketIoClient({
    channel: '/socket.io/web-rtc',
    autoConnect: true,
    listeners: {
      connect: () => {
        console.log('[WebRTC] Socket.IO connected, joining room:', roomId);
        const socket = getSocket();
        socketRef.current = socket;
        if (socket) {
          socket.emit('webrtcJoin', roomId);
        }
      },
      webrtcJoined: (payload: { isOffer: boolean }) => {
        console.log('[WebRTC] Joined room, isOffer:', payload.isOffer);
        isOfferRef.current = payload.isOffer;
      },
      webrtcNewUser: async () => {
        console.log('[WebRTC] New user joined, isOffer:', isOfferRef.current);
        if (isOfferRef.current) {
          console.log('[WebRTC] Creating offer...');
          const offer = await webRTCRef.current.createOffer();
          if (offer) {
            console.log('[WebRTC] Sending offer:', offer.type);
            emit('webrtcDescription', offer);
          } else {
            console.error('[WebRTC] Failed to create offer');
          }
        }
      },
      webrtcDescription: async (payload: RTCSessionDescriptionInit) => {
        console.log('[WebRTC] Received description:', payload.type);
        await webRTCRef.current.setRemoteDescription(payload);

        if (payload.type === 'offer') {
          console.log('[WebRTC] Creating answer...');
          const answer = await webRTCRef.current.createAnswer();
          if (answer) {
            console.log('[WebRTC] Sending answer:', answer.type);
            emit('webrtcDescription', answer);
          } else {
            console.error('[WebRTC] Failed to create answer');
          }
        }
      },
      webrtcCandidate: async (payload: RTCIceCandidateInit) => {
        console.log('[WebRTC] Received ICE candidate');
        await webRTCRef.current.addIceCandidate(payload);
      }
    }
  });

  // 更新 socketRef
  useEffect(() => {
    socketRef.current = getSocket();
  }, [getSocket, isSocketConnected]);

  const isPeerConnected =
    iceConnectionState === 'connected' || iceConnectionState === 'completed';

  const handleCopyId = async () => {
    if (copiedId) return;
    try {
      await navigator.clipboard.writeText(roomId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleCopyUrl = async () => {
    if (copiedUrl) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    closeWebRTC();
    router.push(`/${locale}/web-rtc/socket-io`);
  };

  // 初始化相機
  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (mounted) {
          localStreamRef.current = stream;
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } else {
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (err) {
        console.error('Camera access error:', err);
        if (mounted) {
          setError(
            '無法存取相機/麥克風。請確保已授予權限且使用 HTTPS/localhost。'
          );
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 當本地串流準備好時，加入 WebRTC
  useEffect(() => {
    if (localStream) {
      addLocalStream(localStream);
    }
  }, [localStream, addLocalStream]);

  // 設置遠端視訊
  useEffect(() => {
    if (remoteStreams.length > 0 && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreams[0];
    }
  }, [remoteStreams]);

  return (
    <section className="web_rtc_room_page">
      <Typography variant="h5" gutterBottom>
        WebRTC 視訊聊天室 (Socket.IO)
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        className="web_rtc_room_page-description"
      >
        配合 Socket.IO 做為 Signaling Server 實作
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 2 }}>
        此為 WebRTC 示範頁面。Socket.IO Signaling 需要後端支援，在 serverless
        環境可能無法運作。
      </Alert>

      <Paper className="web_rtc_room_page-room_info" onClick={handleCopyUrl}>
        <Typography variant="body2">
          目前配對 ID 為: <strong>{roomId}</strong>
        </Typography>
        <Chip
          size="small"
          label={
            isPeerConnected
              ? '通話中'
              : isSocketConnected
                ? '等待連線'
                : 'Socket 連線中...'
          }
          color={
            isPeerConnected
              ? 'success'
              : isSocketConnected
                ? 'primary'
                : 'default'
          }
        />
        <Tooltip title={copiedId ? '已複製!' : '複製 ID'}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyId();
            }}
          >
            {copiedId ? (
              <CheckIcon fontSize="small" />
            ) : (
              <ContentCopyIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title={copiedUrl ? '已複製!' : '複製連結'}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyUrl();
            }}
          >
            {copiedUrl ? (
              <CheckIcon fontSize="small" />
            ) : (
              <LinkIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Paper>

      <div className="web_rtc_room_page-video_container">
        <Paper
          className="web_rtc_room_page-video_container-local"
          sx={{ p: 1 }}
        >
          <Typography variant="subtitle2" gutterBottom>
            本地視訊
          </Typography>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              maxHeight: 300,
              backgroundColor: '#000',
              borderRadius: 4
            }}
          />
        </Paper>

        <Paper
          className="web_rtc_room_page-video_container-remote"
          sx={{ p: 1 }}
        >
          <Typography variant="subtitle2" gutterBottom>
            遠端視訊
          </Typography>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              maxHeight: 300,
              backgroundColor: '#000',
              borderRadius: 4
            }}
          />
        </Paper>
      </div>

      <div className="web_rtc_room_page-controls">
        <Tooltip title={isVideoEnabled ? '關閉視訊' : '開啟視訊'}>
          <IconButton
            color={isVideoEnabled ? 'primary' : 'default'}
            onClick={toggleVideo}
            sx={{ bgcolor: isVideoEnabled ? 'primary.light' : 'grey.300' }}
          >
            {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title={isAudioEnabled ? '關閉麥克風' : '開啟麥克風'}>
          <IconButton
            color={isAudioEnabled ? 'primary' : 'default'}
            onClick={toggleAudio}
            sx={{ bgcolor: isAudioEnabled ? 'primary.light' : 'grey.300' }}
          >
            {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="結束通話">
          <IconButton
            color="error"
            onClick={handleEndCall}
            sx={{ bgcolor: 'error.light' }}
          >
            <CallEndIcon />
          </IconButton>
        </Tooltip>
      </div>
    </section>
  );
}
