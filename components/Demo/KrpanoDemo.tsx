'use client';

import { useState, useCallback, useEffect } from 'react';

import Button from '@mui/material/Button';

import Krpano, { HotspotConfig } from '@/components/Krpano';
import style from '@/app/[locale]/krpano-demo/page.module.scss';

interface KrpanoDemoProps {
  /** XML 配置路徑 */
  xml?: string;
  /** 初始場景 */
  startScene?: string;
  /** 熱點 A 配置 */
  hotspotA?: Partial<HotspotConfig>;
  /** 熱點 B 配置 */
  hotspotB?: Partial<HotspotConfig>;
  /** 是否啟用切換功能 */
  enableToggle?: boolean;
  /** 說明文字 - 標題 */
  instructionTitle?: string;
  /** 說明文字 - 內容 */
  instructionContent?: string;
  /** 場景列表 */
  scenes?: Array<{ name: string; label: string }>;
  /** 載入中文字 */
  loadingText?: string;
  /** 熱點 A 按鈕文字 */
  toggleHotspotALabel?: string;
  /** 熱點 B 按鈕文字 */
  toggleHotspotBLabel?: string;
}

const DEFAULT_SCENES = [
  { name: 'scene_bryan_goff_iuyhxaia8ea_unsplash', label: '場景 1 (極光)' },
  {
    name: 'scene_timothy_oldfield_luufnhochru_unsplash',
    label: '場景 2 (港口)'
  }
];

export default function KrpanoDemo({
  xml,
  startScene,
  hotspotA,
  hotspotB,
  enableToggle = true,
  instructionTitle = '操作說明',
  instructionContent = '點擊熱點 A 來切換熱點 B 的顯示/隱藏狀態',
  scenes = DEFAULT_SCENES,
  loadingText = '載入全景中...',
  toggleHotspotALabel = 'Toggle Hotspot A',
  toggleHotspotBLabel = 'Toggle Hotspot B'
}: KrpanoDemoProps) {
  // 載入狀態
  const [isLoaded, setIsLoaded] = useState(false);

  // 使用 State 管理狀態，而非透過 Ref 命令式操作
  const [currentScene, setCurrentScene] = useState(startScene);
  const [isHotspotAVisible, setIsHotspotAVisible] = useState(
    hotspotA?.visible ?? true
  );
  const [isHotspotBVisible, setIsHotspotBVisible] = useState(
    hotspotB?.visible ?? true
  );

  const [isDebug, setIsDebug] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleReady = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleToggleHotspotA = () => {
    setIsHotspotAVisible((prev) => !prev);
  };

  const handleToggleHotspotB = () => {
    setIsHotspotBVisible((prev) => !prev);
  };

  const handleLoadScene = (sceneName: string) => {
    setCurrentScene(sceneName);
  };

  const toggleDebug = () => setIsDebug((prev) => !prev);
  const toggleInfo = () => setIsInfoOpen((prev) => !prev);
  
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const toggleControls = () => setIsControlsOpen((prev) => !prev);
  
  // Auto-collapse controls after initial load
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setIsControlsOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);


  // 整合 Props 與 State
  const mergedHotspotA = { ...hotspotA, visible: isHotspotAVisible };
  const mergedHotspotB = { ...hotspotB, visible: isHotspotBVisible };

  return (
    <div className={style.krpano_demo}>
      {/* Loading Overlay */}
      <div
        className={style['krpano_demo-loading']}
        css-is-loaded={isLoaded ? 'true' : 'false'}
      >
        <div className={style['krpano_demo-loading-spinner']} />
        <p className={style['krpano_demo-loading-text']}>{loadingText}</p>
      </div>

      {/* Header */}
      <div className={style['krpano_demo-header']}>
        <h1 className={style['krpano_demo-header-title']}>{instructionTitle}</h1>
      </div>

      {/* VR Viewer */}
      <div className={style['krpano_demo-container']}>
        <Krpano
          xml={xml}
          startScene={startScene}
          currentScene={currentScene}
          hotspotA={mergedHotspotA}
          hotspotB={mergedHotspotB}
          enableToggle={enableToggle}
          className={style['krpano_demo-container-viewer']}
          onReady={handleReady}
          debug={isDebug}
        />
      </div>

      {/* Controls */}
      <div 
        className={style['krpano_demo-controls']}
        data-open={isControlsOpen}
      >
        {/* Toggle Button */}
        <button
          className={style['krpano_demo-controls-toggle']}
          onClick={toggleControls}
          aria-label={isControlsOpen ? '收起選單' : '展開選單'}
        >
          {isControlsOpen ? '▶' : '◀'}
        </button>
        
        <div className={style['krpano_demo-controls-scroll-area']}>
          {/* Info Group */}
          <div className={style['krpano_demo-controls-group']}>
             <div className={style['krpano_demo-controls-group-label']}>說明文件</div>
             <Button
                variant="text"
                onClick={toggleInfo}
                className={style['krpano_demo-controls-group-button']}
                data-variant="info"
              >
                {isInfoOpen ? '收起說明' : '顯示說明'}
              </Button>
              
              <div 
                className={style['krpano_demo-controls-group-drawer']} 
                data-expanded={isInfoOpen}
              >
                 <div className={style['krpano_demo-controls-group-drawer-content']}>
                   <p className={style['krpano_demo-controls-group-drawer-content-description']}>{instructionContent}</p>
                   <div className={style['krpano_demo-controls-group-drawer-content-debug_info']}>
                      <p><strong>除錯模式：</strong>開啟後可查看執行紀錄。</p>
                      <p><strong>快捷鍵：</strong>按下 <code>~</code> 鍵可開關 Log。</p>
                   </div>
                 </div>
              </div>
          </div>

          <div className={style['krpano_demo-controls-group']}>
              <div className={style['krpano_demo-controls-group-label']}>熱點控制</div>
              <Button
                variant="contained"
                className={style['krpano_demo-controls-group-button']}
                onClick={handleToggleHotspotA}
              >
                {toggleHotspotALabel}
              </Button>
              <Button
                variant="contained"
                className={style['krpano_demo-controls-group-button']}
                onClick={handleToggleHotspotB}
              >
                {toggleHotspotBLabel}
              </Button>
          </div>

          <div className={style['krpano_demo-controls-group']}>
             <div className={style['krpano_demo-controls-group-label']}>場景切換</div>
              {scenes.map((scene) => (
                <Button
                  key={scene.name}
                  variant="contained"
                  className={style['krpano_demo-controls-group-button']}
                  css-type="scene"
                  onClick={() => handleLoadScene(scene.name)}
                >
                  {scene.label}
                </Button>
              ))}
          </div>

          <div className={style['krpano_demo-controls-group']}>
             <div className={style['krpano_demo-controls-group-label']}>開發工具</div>
              <Button
                variant="outlined"
                color={isDebug ? 'warning' : 'primary'}
                className={style['krpano_demo-controls-group-button']}
                onClick={toggleDebug}
              >
                {isDebug ? '關閉 Log' : '開啟 Log'}
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
