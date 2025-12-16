'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { nanoid } from 'nanoid';
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

import '@/app/[locale]/web-rtc/web-rtc.scss';

export default function WebRTCWebSocketRoomPage(): React.ReactNode {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const roomId = params?.roomId as string;
  const userId = useRef(nanoid());

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('無法存取相機/麥克風。請確保已授予權限且使用 HTTPS/localhost。');
    }
  }, []);

  const initPeerConnection = useCallback(() => {
    const config: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE candidate:', event.candidate);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
      setIsConnected(pc.iceConnectionState === 'connected');
    };

    pc.ontrack = (event) => {
      console.log('Remote track received');
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        if (localStreamRef.current) {
          pc.addTrack(track, localStreamRef.current);
        }
      });
    }

    peerConnectionRef.current = pc;
    return pc;
  }, []);

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
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    router.push(`/${locale}/web-rtc/websocket`);
  };

  useEffect(() => {
    initCamera().then(() => {
      initPeerConnection();
    });

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [initCamera, initPeerConnection]);

  return (
    <section className="web_rtc_room_page">
      <Typography variant="h5" gutterBottom>
        WebRTC 視訊聊天室 (WebSocket)
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        className="web_rtc_room_page-description"
      >
        配合原生 WebSocket 做為 Signaling 實作
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 2 }}>
        此為 WebRTC 示範頁面。WebSocket Signaling 需要後端支援，在 serverless
        環境可能無法運作。
      </Alert>

      <Paper className="web_rtc_room_page-room_info" onClick={handleCopyUrl}>
        <Typography variant="body2">
          目前配對 ID 為: <strong>{roomId}</strong>
        </Typography>
        <Chip
          size="small"
          label={isConnected ? '已連線' : '等待連線'}
          color={isConnected ? 'success' : 'default'}
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
