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
  /** 說明文件標籤 */
  docLabel?: string;
  /** 熱點控制標籤 */
  hotspotLabel?: string;
  /** 場景切換標籤 */
  sceneLabel?: string;
  /** 開發工具標籤 */
  devToolsLabel?: string;
  /** 顯示說明按鈕文字 */
  showInfoLabel?: string;
  /** 隱藏說明按鈕文字 */
  hideInfoLabel?: string;
  /** 除錯模式說明 */
  debugModeDesc?: string;
  /** 快捷鍵說明 */
  shortcutDesc?: string;
  /** 開啟 Log 按鈕文字 */
  openLogLabel?: string;
  /** 關閉 Log 按鈕文字 */
  closeLogLabel?: string;
  /** 收起選單按鈕文字 */
  collapseMenuLabel?: string;
  /** 展開選單按鈕文字 */
  expandMenuLabel?: string;
  /** Krpano 動態文字 */
  dynamicText?: string;
}

const DEFAULT_SCENES = [
  { name: 'scene_bryan_goff_iuyhxaia8ea_unsplash', label: '場景 1 (極光)' },
  {
    name: 'scene_timothy_oldfield_luufnhochru_unsplash',
    label: '場景 2 (港口)'
  }
];

// Button Styles
const commonButtonSx = {
  minWidth: 'auto',
  padding: { xs: '0.4rem 0.8rem', md: '0.6rem 1.2rem' },
  fontSize: { xs: '0.7rem', md: '0.85rem' },
  fontWeight: 600,
  color: '#fff',
  textTransform: 'none',
  background: 'rgba(0, 0, 0, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '2rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(8px)',
  pointerEvents: 'auto',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.85)',
    borderColor: '#fff',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
};

const infoButtonSx = {
  ...commonButtonSx,
  color: '#ffd700',
  borderColor: 'rgba(255, 215, 0, 0.4)',
  '&:hover': {
    ...commonButtonSx['&:hover'],
    background: 'rgba(255, 215, 0, 0.15)',
    borderColor: '#ffd700',
  },
};

const sceneButtonSx = {
  ...commonButtonSx,
  background:
    'linear-gradient(135deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 100%)',
  borderColor: 'rgba(102, 126, 234, 0.4)',
  '&:hover': {
    ...commonButtonSx['&:hover'],
    background:
      'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
    borderColor: '#fff',
  },
};

const toggleButtonSx = {
  position: 'absolute',
  top: '1rem',
  left: -28,
  zIndex: 35,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 48,
  minWidth: 0,
  padding: 0,
  fontSize: '0.8rem',
  color: 'rgba(255, 255, 255, 0.8)',
  background: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRight: 'none',
  borderRadius: '8px 0 0 8px',
  backdropFilter: 'blur(4px)',
  pointerEvents: 'auto',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.4)',
    boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.2)',
  },
};

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
  toggleHotspotBLabel = 'Toggle Hotspot B',
  docLabel = '說明文件',
  hotspotLabel = '熱點控制',
  sceneLabel = '場景切換',
  devToolsLabel = '開發工具',
  showInfoLabel = '顯示說明',
  hideInfoLabel = '收起說明',
  debugModeDesc = '除錯模式：開啟後可查看執行紀錄。',
  shortcutDesc = '快捷鍵：按下 ~ 鍵可開關 Log。',
  openLogLabel = '開啟 Log',
  closeLogLabel = '關閉 Log',
  collapseMenuLabel = '收起選單',
  expandMenuLabel = '展開選單',
  dynamicText
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
        <h1 className={style['krpano_demo-header-title']}>
          {instructionTitle}
        </h1>
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
          textLayerContent={dynamicText}
        />
      </div>

      {/* Controls */}
      <div
        className={style['krpano_demo-controls']}
        css-open={`${isControlsOpen}`}
        css-is-debug={`${isDebug}`}
      >
        {/* Toggle Button */}
        <Button
          sx={{
            ...toggleButtonSx,
            ...(!isControlsOpen && {
              background: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.8)',
              },
            }),
          }}
          onClick={toggleControls}
          aria-label={isControlsOpen ? collapseMenuLabel : expandMenuLabel}
        >
          {isControlsOpen ? '▶' : '◀'}
        </Button>

        <div className={style['krpano_demo-controls-scroll_area']}>
          {/* Info Group */}
          <div className={style['krpano_demo-controls-scroll_area-group']}>
            <div
              className={style['krpano_demo-controls-scroll_area-group-label']}
            >
              {docLabel}
            </div>
            <Button
              variant="text"
              onClick={toggleInfo}
              sx={infoButtonSx}
            >
              {isInfoOpen ? hideInfoLabel : showInfoLabel}
            </Button>

            <div
              className={style['krpano_demo-controls-scroll_area-group-drawer']}
              css-expanded={`${isInfoOpen}`}
            >
              <div
                className={
                  style[
                    'krpano_demo-controls-scroll_area-group-drawer-content'
                  ]
                }
              >
                <p
                  className={
                    style[
                      'krpano_demo-controls-scroll_area-group-drawer-content-description'
                    ]
                  }
                >
                  {instructionContent}
                </p>
                <div
                  className={
                    style[
                      'krpano_demo-controls-scroll_area-group-drawer-content-debug_info'
                    ]
                  }
                >
                  <p>{debugModeDesc}</p>
                  <p>{shortcutDesc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={style['krpano_demo-controls-scroll_area-group']}>
            <div
              className={style['krpano_demo-controls-scroll_area-group-label']}
            >
              {hotspotLabel}
            </div>
            <div
              className={
                style['krpano_demo-controls-scroll_area-group-hotspot']
              }
            >
              <Button
                variant="contained"
                sx={commonButtonSx}
                onClick={handleToggleHotspotA}
              >
                {toggleHotspotALabel}
              </Button>
              <Button
                variant="contained"
                sx={commonButtonSx}
                onClick={handleToggleHotspotB}
              >
                {toggleHotspotBLabel}
              </Button>
            </div>
          </div>

          <div className={style['krpano_demo-controls-scroll_area-group']}>
            <div
              className={style['krpano_demo-controls-scroll_area-group-label']}
            >
              {sceneLabel}
            </div>
            <div
              className={style['krpano_demo-controls-scroll_area-group-scene']}
            >
              {scenes.map((scene) => (
                <Button
                  key={scene.name}
                  variant="contained"
                  sx={sceneButtonSx}
                  onClick={() => handleLoadScene(scene.name)}
                >
                  {scene.label}
                </Button>
              ))}
            </div>
          </div>

          <div className={style['krpano_demo-controls-scroll_area-group']}>
            <div
              className={style['krpano_demo-controls-scroll_area-group-label']}
            >
              {devToolsLabel}
            </div>
            <Button
              variant="outlined"
              color={isDebug ? 'warning' : 'primary'}
              sx={commonButtonSx}
              onClick={toggleDebug}
            >
              {isDebug ? closeLogLabel : openLogLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
