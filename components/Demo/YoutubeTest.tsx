'use client';

import { useState, useRef } from 'react';
import Youtube from '@/components/Youtube';

import styles from '@/app/[locale]/components/youtube-test/page.module.scss';

export default function YoutubeTest() {
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
    <>
      <h1>Youtube 播放器測試</h1>
      <p className={styles['youtube_test_page-description']}>
        測試 YouTube 影片嵌入播放功能
      </p>

      <div className={styles['youtube_test_page-section']}>
        <h2 className={styles['youtube_test_page-section_title']}>
          當前播放影片
        </h2>
        <div className={styles['youtube_test_page-video_wrapper']}>
          <div className={styles['youtube_test_page-video_inner']}>
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

      <div className={styles['youtube_test_page-section']}>
        <h2 className={styles['youtube_test_page-section_title']}>
          載入自訂影片
        </h2>
        <div className={styles['youtube_test_page-input_group']}>
          <input
            type="text"
            value={customVideoId}
            onChange={(e) => setCustomVideoId(e.target.value)}
            placeholder="輸入 YouTube 影片 ID"
            className={styles['youtube_test_page-input']}
          />
          <button
            onClick={handleLoadVideo}
            className={styles['youtube_test_page-button']}
          >
            載入影片
          </button>
        </div>
        <p className={styles['youtube_test_page-hint']}>
          提示: 從 YouTube 網址中取得影片 ID,例如
          https://www.youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>
        </p>
      </div>

      <div className={styles['youtube_test_page-section']}>
        <h2 className={styles['youtube_test_page-section_title']}>
          熱門影片範例
        </h2>
        <div className={styles['youtube_test_page-popular_grid']}>
          {popularVideos.map((video) => (
            <button
              key={video.id}
              onClick={() => setVideoId(video.id)}
              className={styles['youtube_test_page-popular_button']}
              css-is-active={videoId === video.id ? 'true' : undefined}
            >
              {video.title}
            </button>
          ))}
        </div>
      </div>

      <div className={styles['youtube_test_page-section']}>
        <h2 className={styles['youtube_test_page-section_title']}>功能說明</h2>
        <ul className={styles['youtube_test_page-features']}>
          <li>✅ 支援 YouTube IFrame API</li>
          <li>✅ 可自訂播放器參數</li>
          <li>✅ 支援事件監聽 (onReady, onStateChange, onError)</li>
          <li>✅ 響應式設計 (16:9 比例)</li>
          <li>✅ 支援自動播放控制</li>
        </ul>
      </div>
    </>
  );
}
