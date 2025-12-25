'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useNextRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { nanoid } from 'nanoid';
import _debounce from 'lodash/debounce';
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
import style from '@/app/[locale]/web-rtc/server-sent-event/room/[roomId]/page.module.scss';

interface MemberCandidate {
  userId: string;
  candidateList: RTCIceCandidateInit[];
}

interface MemberDescription {
  userId: string;
  description: RTCSessionDescriptionInit;
}

interface WebRTCSettings {
  roomId: string;
  userId: string;
  memberCandidateList: MemberCandidate[];
  memberDescriptionList: MemberDescription[];
  isOffer?: boolean;
  isAnswer?: boolean;
}

export default function WebRTCSSERoom(): React.ReactNode {
  const params = useParams();
  const router = useNextRouter();
  const locale = useLocale();
  const roomId = params?.roomId as string;
  const userIdRef = useRef(nanoid());
  const userId = userIdRef.current;

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const iceCandidatesRef = useRef<RTCIceCandidate[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const remoteDescriptionSetRef = useRef(false);

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<string>('new');
  const [isOffer, setIsOffer] = useState<boolean | undefined>(undefined);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error('Camera access error:', err);
      setError('無法存取相機/麥克風。請確保已授予權限且使用 HTTPS/localhost。');
      return null;
    }
  }, []);

  const sendCandidatesToServerRef = useRef(
    _debounce(async (candidates: RTCIceCandidate[], roomIdVal: string, userIdVal: string) => {
      if (candidates.length === 0) return;
      try {
        await fetch('/api/web-rtc/candidate-list', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: roomIdVal,
            userId: userIdVal,
            candidateList: candidates.map((c) => c.toJSON())
          })
        });
      } catch {
        console.error('Failed to send candidates');
      }
    }, 200)
  );

  const sendDescriptionToServerRef = useRef(
    _debounce(async (description: RTCSessionDescriptionInit, roomIdVal: string, userIdVal: string) => {
      try {
        await fetch('/api/web-rtc/description', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId: roomIdVal, userId: userIdVal, description })
        });
      } catch {
        console.error('Failed to send description');
      }
    }, 200)
  );

  const sendCandidatesToServer = useCallback((candidates: RTCIceCandidate[]) => {
    sendCandidatesToServerRef.current(candidates, roomId, userId);
  }, [roomId, userId]);

  const sendDescriptionToServer = useCallback((description: RTCSessionDescriptionInit) => {
    sendDescriptionToServerRef.current(description, roomId, userId);
  }, [roomId, userId]);

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
        iceCandidatesRef.current.push(event.candidate);
        sendCandidatesToServer(iceCandidatesRef.current);
      }
    };

    pc.oniceconnectionstatechange = () => {
      setConnectionState(pc.iceConnectionState);
      setIsConnected(pc.iceConnectionState === 'connected');
    };

    pc.ontrack = (event) => {
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
  }, [sendCandidatesToServer]);

  const handleWebRTCSettings = useCallback(async (settings: WebRTCSettings) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    if (settings.isOffer !== undefined && isOffer === undefined) {
      setIsOffer(settings.isOffer);

      if (settings.isOffer === true) {
        try {
          if (pc.signalingState === 'closed') return;
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendDescriptionToServer(offer);
        } catch (err) {
          console.error('Failed to create offer:', err);
        }
      }
    }

    for (const member of settings.memberDescriptionList) {
      if (member.userId === userId) continue;
      if (remoteDescriptionSetRef.current) continue;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(member.description));
        remoteDescriptionSetRef.current = true;

        if (member.description.type === 'offer') {
          if (pc.signalingState === 'closed') return;
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendDescriptionToServer(answer);
        }
      } catch (err) {
        console.error('Failed to set remote description:', err);
      }
    }

    for (const member of settings.memberCandidateList) {
      if (member.userId === userId) continue;
      for (const candidate of member.candidateList) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch {
          // Ignore duplicate candidates
        }
      }
    }
  }, [userId, isOffer, sendDescriptionToServer]);

  const joinRoom = useCallback(async () => {
    try {
      await fetch('/api/web-rtc/join-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, userId })
      });

      const eventSource = new EventSource(`/api/web-rtc/subscription/${roomId}?userId=${userId}`);

      eventSource.addEventListener('webrtc', (event) => {
        try {
          const settings: WebRTCSettings = JSON.parse(event.data);
          handleWebRTCSettings(settings);
        } catch (err) {
          console.error('Failed to parse WebRTC settings:', err);
        }
      });

      eventSource.onerror = () => {
        console.error('SSE error');
      };

      eventSourceRef.current = eventSource;
    } catch (err) {
      console.error('Failed to join room:', err);
      setError('無法加入房間');
    }
  }, [roomId, userId, handleWebRTCSettings]);

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
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    router.push(`/${locale}/web-rtc/server-sent-event`);
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!mounted) return;
      await initCamera();
      if (!mounted) return;
      initPeerConnection();
      if (!mounted) return;
      await joinRoom();
    };

    init();

    return () => {
      mounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        WebRTC 視訊聊天室 (SSE)
      </Typography>

      <Typography variant="body2" color="text.secondary" className={style['web_rtc_sse_room_page-description']}>
        配合 Server-Sent Events 及 Upstash Redis 實作
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper className={style['web_rtc_sse_room_page-room_info']} onClick={handleCopyUrl}>
        <Typography variant="body2">
          目前配對 ID 為: <strong>{roomId}</strong>
        </Typography>
        <Chip size="small" label={isConnected ? '已連線' : `狀態: ${connectionState}`} color={isConnected ? 'success' : 'default'} />
        <Chip size="small" label={isOffer === true ? 'Offerer' : isOffer === false ? 'Answerer' : '等待中'} color="info" variant="outlined" />
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

      <div className={style['web_rtc_sse_room_page-video_container']}>
        <Paper className={style['web_rtc_sse_room_page-video_container-local']} sx={{ p: 1 }}>
          <Typography variant="subtitle2" gutterBottom>本地視訊</Typography>
          <video ref={localVideoRef} className={style['web_rtc_sse_room_page-video_container-video']} autoPlay muted playsInline />
        </Paper>

        <Paper className={style['web_rtc_sse_room_page-video_container-remote']} sx={{ p: 1 }}>
          <Typography variant="subtitle2" gutterBottom>遠端視訊</Typography>
          <video ref={remoteVideoRef} className={style['web_rtc_sse_room_page-video_container-video']} autoPlay playsInline />
        </Paper>
      </div>

      <div className={style['web_rtc_sse_room_page-controls']}>
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
