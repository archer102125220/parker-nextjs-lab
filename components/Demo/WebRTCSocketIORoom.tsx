'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useNextRouter } from '@/i18n/navigation';
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
import style from '@/app/[locale]/web-rtc/socket-io/room/[roomId]/page.module.scss';

export default function WebRTCSocketIORoom(): React.ReactNode {
  const params = useParams();
  const router = useNextRouter();
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
      socketRef.current?.emit('webrtcCandidate', candidate.toJSON());
    },
    onRemoteStream: (stream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    },
    onIceConnectionStateChange: (state) => {
      console.log('[WebRTC] ICE connection state:', state);
    }
  });

  const webRTCRef = useRef({
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate
  });

  useEffect(() => {
    webRTCRef.current = {
      createOffer,
      createAnswer,
      setRemoteDescription,
      addIceCandidate
    };
  }, [createOffer, createAnswer, setRemoteDescription, addIceCandidate]);

  const socketRef = useRef<ReturnType<typeof useSocketIoClient>['getSocket'] extends () => infer T ? T : never>(null);

  const {
    isConnected: isSocketConnected,
    emit,
    getSocket
  } = useSocketIoClient({
    channel: '/socket.io/web-rtc',
    autoConnect: true,
    listeners: {
      connect: () => {
        const socket = getSocket();
        socketRef.current = socket;
        if (socket) {
          socket.emit('webrtcJoin', roomId);
        }
      },
      webrtcJoined: (payload: { isOffer: boolean }) => {
        isOfferRef.current = payload.isOffer;
      },
      webrtcNewUser: async () => {
        if (isOfferRef.current) {
          const offer = await webRTCRef.current.createOffer();
          if (offer) {
            emit('webrtcDescription', offer);
          }
        }
      },
      webrtcDescription: async (payload: RTCSessionDescriptionInit) => {
        await webRTCRef.current.setRemoteDescription(payload);
        if (payload.type === 'offer') {
          const answer = await webRTCRef.current.createAnswer();
          if (answer) {
            emit('webrtcDescription', answer);
          }
        }
      },
      webrtcCandidate: async (payload: RTCIceCandidateInit) => {
        await webRTCRef.current.addIceCandidate(payload);
      }
    }
  });

  useEffect(() => {
    socketRef.current = getSocket();
  }, [getSocket, isSocketConnected]);

  const isPeerConnected = iceConnectionState === 'connected' || iceConnectionState === 'completed';

  const handleCopyId = async () => {
    if (copiedId) return;
    await navigator.clipboard.writeText(roomId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyUrl = async () => {
    if (copiedUrl) return;
    await navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
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
          setError('無法存取相機/麥克風。請確保已授予權限且使用 HTTPS/localhost。');
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

  useEffect(() => {
    if (localStream) {
      addLocalStream(localStream);
    }
  }, [localStream, addLocalStream]);

  useEffect(() => {
    if (remoteStreams.length > 0 && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreams[0];
    }
  }, [remoteStreams]);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        WebRTC 視訊聊天室 (Socket.IO)
      </Typography>

      <Typography variant="body2" color="text.secondary" className={style['web_rtc_socket_io_room_page-description']}>
        配合 Socket.IO 做為 Signaling Server 實作
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 2 }}>
        此為 WebRTC 示範頁面。Socket.IO Signaling 需要後端支援，在 serverless 環境可能無法運作。
      </Alert>

      <Paper className={style['web_rtc_socket_io_room_page-room_info']} onClick={handleCopyUrl}>
        <Typography variant="body2">
          目前配對 ID 為: <strong>{roomId}</strong>
        </Typography>
        <Chip
          size="small"
          label={isPeerConnected ? '通話中' : isSocketConnected ? '等待連線' : 'Socket 連線中...'}
          color={isPeerConnected ? 'success' : isSocketConnected ? 'primary' : 'default'}
        />
        <Tooltip title={copiedId ? '已複製!' : '複製 ID'}>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleCopyId(); }}>
            {copiedId ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Tooltip title={copiedUrl ? '已複製!' : '複製連結'}>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleCopyUrl(); }}>
            {copiedUrl ? <CheckIcon fontSize="small" /> : <LinkIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Paper>

      <div className={style['web_rtc_socket_io_room_page-video_container']}>
        <Paper className={style['web_rtc_socket_io_room_page-video_container-local']} sx={{ p: 1 }}>
          <Typography variant="subtitle2" gutterBottom>本地視訊</Typography>
          <video ref={localVideoRef} className={style['web_rtc_socket_io_room_page-video_container-video']} autoPlay muted playsInline />
        </Paper>

        <Paper className={style['web_rtc_socket_io_room_page-video_container-remote']} sx={{ p: 1 }}>
          <Typography variant="subtitle2" gutterBottom>遠端視訊</Typography>
          <video ref={remoteVideoRef} className={style['web_rtc_socket_io_room_page-video_container-video']} autoPlay playsInline />
        </Paper>
      </div>

      <div className={style['web_rtc_socket_io_room_page-controls']}>
        <Tooltip title={isVideoEnabled ? '關閉視訊' : '開啟視訊'}>
          <IconButton color={isVideoEnabled ? 'primary' : 'default'} onClick={toggleVideo} sx={{ bgcolor: isVideoEnabled ? 'primary.light' : 'grey.300' }}>
            {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title={isAudioEnabled ? '關閉麥克風' : '開啟麥克風'}>
          <IconButton color={isAudioEnabled ? 'primary' : 'default'} onClick={toggleAudio} sx={{ bgcolor: isAudioEnabled ? 'primary.light' : 'grey.300' }}>
            {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="結束通話">
          <IconButton color="error" onClick={handleEndCall} sx={{ bgcolor: 'error.light' }}>
            <CallEndIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
}
