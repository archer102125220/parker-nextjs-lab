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

import '@/app/[locale]/web-rtc/web-rtc.scss';

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

export default function WebRTCSSERoomPage(): React.ReactNode {
  const params = useParams();
  const router = useNextRouter();
  const locale = useLocale();
  const roomId = params?.roomId as string;
  const userIdRef = useRef(nanoid());
  const userId = userIdRef.current;

  // Video/Audio refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const iceCandidatesRef = useRef<RTCIceCandidate[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const remoteDescriptionSetRef = useRef(false);

  // State
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<string>('new');
  const [isOffer, setIsOffer] = useState<boolean | undefined>(undefined);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize camera
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
      return stream;
    } catch (err) {
      console.error('Camera access error:', err);
      setError('無法存取相機/麥克風。請確保已授予權限且使用 HTTPS/localhost。');
      return null;
    }
  }, []);

  // Send ICE candidates to server (debounced) - using ref to avoid render-time access
  const sendCandidatesToServerRef = useRef(
    _debounce(
      async (
        candidates: RTCIceCandidate[],
        roomIdVal: string,
        userIdVal: string
      ) => {
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
      },
      200
    )
  );

  // Send description to server (debounced)
  const sendDescriptionToServerRef = useRef(
    _debounce(
      async (
        description: RTCSessionDescriptionInit,
        roomIdVal: string,
        userIdVal: string
      ) => {
        try {
          await fetch('/api/web-rtc/description', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomId: roomIdVal,
              userId: userIdVal,
              description
            })
          });
        } catch {
          console.error('Failed to send description');
        }
      },
      200
    )
  );

  // Wrapper functions that pass current values
  const sendCandidatesToServer = useCallback(
    (candidates: RTCIceCandidate[]) => {
      sendCandidatesToServerRef.current(candidates, roomId, userId);
    },
    [roomId, userId]
  );

  const sendDescriptionToServer = useCallback(
    (description: RTCSessionDescriptionInit) => {
      sendDescriptionToServerRef.current(description, roomId, userId);
    },
    [roomId, userId]
  );

  // Initialize WebRTC peer connection
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
        iceCandidatesRef.current.push(event.candidate);
        sendCandidatesToServer(iceCandidatesRef.current);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
      setConnectionState(pc.iceConnectionState);
      setIsConnected(pc.iceConnectionState === 'connected');
    };

    pc.ontrack = (event) => {
      console.log('Remote track received');
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Add local tracks to peer connection
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

  // Handle WebRTC signaling message
  const handleWebRTCSettings = useCallback(
    async (settings: WebRTCSettings) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      // Set isOffer/isAnswer
      if (settings.isOffer !== undefined && isOffer === undefined) {
        setIsOffer(settings.isOffer);

        // If we're the offerer, create offer
        if (settings.isOffer === true) {
          try {
            // Check if connection is still valid
            if (pc.signalingState === 'closed') {
              console.warn('Peer connection is closed, skipping offer creation');
              return;
            }
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            sendDescriptionToServer(offer);
          } catch (err) {
            console.error('Failed to create offer:', err);
          }
        }
      }

      // Process remote descriptions
      for (const member of settings.memberDescriptionList) {
        if (member.userId === userId) continue;
        if (remoteDescriptionSetRef.current) continue;

        try {
          console.log('Setting remote description:', member.description.type);
          await pc.setRemoteDescription(
            new RTCSessionDescription(member.description)
          );
          remoteDescriptionSetRef.current = true;

          // If we received an offer, create answer
          if (member.description.type === 'offer') {
            // Check if connection is still valid
            if (pc.signalingState === 'closed') {
              console.warn('Peer connection is closed, skipping answer creation');
              return;
            }
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendDescriptionToServer(answer);
          }
        } catch (err) {
          console.error('Failed to set remote description:', err);
        }
      }

      // Process remote candidates
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
    },
    [userId, isOffer, sendDescriptionToServer]
  );

  // Join room and connect to SSE
  const joinRoom = useCallback(async () => {
    try {
      // Join room via API
      const response = await fetch('/api/web-rtc/join-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, userId })
      });
      const data = await response.json();
      console.log('Joined room:', data);

      // Connect to SSE for signaling
      const eventSource = new EventSource(
        `/api/web-rtc/subscription/${roomId}?userId=${userId}`
      );

      eventSource.addEventListener('webrtc', (event) => {
        try {
          const settings: WebRTCSettings = JSON.parse(event.data);
          handleWebRTCSettings(settings);
        } catch (err) {
          console.error('Failed to parse WebRTC settings:', err);
        }
      });

      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
      };

      eventSourceRef.current = eventSource;
    } catch (err) {
      console.error('Failed to join room:', err);
      setError('無法加入房間');
    }
  }, [roomId, userId, handleWebRTCSettings]);

  // Copy functions
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

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // End call
  const handleEndCall = () => {
    // Clean up
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

  // Initialize on mount
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
      
      // Clean up media stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop();
          console.log('Stopped track:', track.kind);
        });
        localStreamRef.current = null;
      }
      
      // Clean up peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
        console.log('Closed peer connection');
      }
      
      // Clean up event source
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        console.log('Closed event source');
      }
      
      // Clear video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  return (
    <section className="web_rtc_room_page">
      <Typography variant="h5" gutterBottom>
        WebRTC 視訊聊天室 (SSE)
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        className="web_rtc_room_page-description"
      >
        配合 Server-Sent Events 及 Upstash Redis 實作
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Room Info */}
      <Paper className="web_rtc_room_page-room_info" onClick={handleCopyUrl}>
        <Typography variant="body2">
          目前配對 ID 為: <strong>{roomId}</strong>
        </Typography>
        <Chip
          size="small"
          label={isConnected ? '已連線' : `狀態: ${connectionState}`}
          color={isConnected ? 'success' : 'default'}
        />
        <Chip
          size="small"
          label={
            isOffer === true
              ? 'Offerer'
              : isOffer === false
                ? 'Answerer'
                : '等待中'
          }
          color="info"
          variant="outlined"
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

      {/* Video Container */}
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

      {/* Controls */}
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
