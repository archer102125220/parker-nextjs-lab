'use client';

import { useState, useRef } from 'react';
import Youtube from '@/components/Youtube';
import '../page.scss';

export default function YoutubeTestPage() {
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ'); // Rick Astley - Never Gonna Give You Up
  const [customVideoId, setCustomVideoId] = useState('');
  const youtubeRef = useRef(null);

  const handleLoadVideo = () => {
    if (customVideoId.trim()) {
      setVideoId(customVideoId.trim());
    }
  };

  const popularVideos = [
    { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up' },
    { id: 'jNQXAC9IVRw', title: 'Me at the zoo (First YouTube Video)' },
    { id: '9bZkp7q19f0', title: 'PSY - GANGNAM STYLE' },
    { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee' }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Youtube 播放器測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        測試 YouTube 影片嵌入播放功能
      </p>

      <div style={{ marginBottom: '40px' }}>
        <h2>當前播放影片</h2>
        <div style={{ 
          position: 'relative', 
          paddingBottom: '56.25%', 
          height: 0, 
          overflow: 'hidden',
          backgroundColor: '#000',
          borderRadius: '8px'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Youtube
              videoId={videoId}
              autoplay={false}
              playerVars={{
                rel: 0,
                controls: 1,
                showinfo: 0,
                enablejsapi: 1,
                wmode: 'opaque'
              }}
              instanceRef={youtubeRef}
              onReady={(player) => {
                console.log('YouTube Player Ready:', player);
              }}
              onStateChange={() => {
                console.log('Player State Changed');
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>載入自訂影片</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            value={customVideoId}
            onChange={(e) => setCustomVideoId(e.target.value)}
            placeholder="輸入 YouTube 影片 ID"
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleLoadVideo}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            載入影片
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#666' }}>
          提示: 從 YouTube 網址中取得影片 ID,例如 https://www.youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>熱門影片範例</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
          {popularVideos.map((video) => (
            <button
              key={video.id}
              onClick={() => setVideoId(video.id)}
              style={{
                padding: '12px',
                backgroundColor: videoId === video.id ? '#1976d2' : '#f5f5f5',
                color: videoId === video.id ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              {video.title}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>功能說明</h2>
        <ul>
          <li>✅ 支援 YouTube IFrame API</li>
          <li>✅ 可自訂播放器參數</li>
          <li>✅ 支援事件監聽 (onReady, onStateChange, onError)</li>
          <li>✅ 響應式設計 (16:9 比例)</li>
          <li>✅ 支援自動播放控制</li>
        </ul>
      </div>
    </div>
  );
}
